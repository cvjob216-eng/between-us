import { NextResponse } from "next/server";
import { db } from "@/db";
import { relationships, notifications } from "@/db/schema";
import { and, eq, isNull, ne, or } from "drizzle-orm";
import {
  getCurrentUser,
  getUserRelationship,
  generateInviteCode,
} from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const relationship = await getUserRelationship(user.id);
  return NextResponse.json({ relationship });
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await req.json();
    const action = body.action as
      | "create_invite"
      | "regenerate_invite"
      | "join"
      | "request_unlink"
      | "cancel_unlink"
      | "confirm_unlink";

    const currentRel = await getUserRelationship(user.id);

    if (action === "create_invite" || action === "regenerate_invite") {
      if (currentRel?.status === "active") {
        return NextResponse.json({ error: "ALREADY_LINKED" }, { status: 409 });
      }

      if (currentRel && currentRel.status === "pending" && currentRel.isUserOne) {
        if (action === "create_invite") {
          return NextResponse.json({ relationship: currentRel });
        }
        const newCode = generateInviteCode();
        const [updated] = await db
          .update(relationships)
          .set({ inviteCode: newCode })
          .where(
            and(
              eq(relationships.id, currentRel.id),
              eq(relationships.status, "pending")
            )
          )
          .returning();
        return NextResponse.json({ relationship: updated });
      }

      const inviteCode = generateInviteCode();
      const [created] = await db
        .insert(relationships)
        .values({
          userOneId: user.id,
          inviteCode,
          status: "pending",
        })
        .returning();

      return NextResponse.json({ relationship: created }, { status: 201 });
    }

    if (action === "join") {
      if (currentRel?.status === "active") {
        return NextResponse.json({ error: "ALREADY_LINKED" }, { status: 409 });
      }

      const rawCode = String(body.inviteCode ?? "").trim().toUpperCase();
      if (!rawCode) {
        return NextResponse.json({ error: "INVALID_CODE" }, { status: 400 });
      }

      const result = await db.transaction(async (tx) => {
        // Double-check user has no active relationship inside transaction
        const [activeCheck] = await tx
          .select({ id: relationships.id })
          .from(relationships)
          .where(
            and(
              or(
                eq(relationships.userOneId, user.id),
                eq(relationships.userTwoId, user.id)
              ),
              eq(relationships.status, "active")
            )
          )
          .limit(1);

        if (activeCheck) {
          return { error: "ALREADY_LINKED" as const };
        }

        // Remove any unused pending invite previously created by the joining user
        await tx
          .delete(relationships)
          .where(
            and(
              eq(relationships.userOneId, user.id),
              eq(relationships.status, "pending"),
              isNull(relationships.userTwoId)
            )
          );

        // Atomically claim pending relationship ONLY if userTwoId IS NULL and userOneId != user.id
        const [linked] = await tx
          .update(relationships)
          .set({
            userTwoId: user.id,
            status: "active",
            linkedAt: new Date(),
          })
          .where(
            and(
              eq(relationships.inviteCode, rawCode),
              eq(relationships.status, "pending"),
              isNull(relationships.userTwoId),
              ne(relationships.userOneId, user.id)
            )
          )
          .returning();

        if (!linked) {
          return { error: "INVALID_CODE" as const };
        }

        await tx
          .insert(notifications)
          .values({
            userId: linked.userOneId,
            type: "partner_linked",
            messageKey: "partner_linked",
          })
          .onConflictDoNothing();

        return { relationship: linked };
      });

      if ("error" in result) {
        return NextResponse.json(
          { error: result.error },
          { status: result.error === "ALREADY_LINKED" ? 409 : 400 }
        );
      }

      const full = await getUserRelationship(user.id);
      return NextResponse.json({ relationship: full });
    }

    if (action === "request_unlink") {
      if (!currentRel || currentRel.status !== "active") {
        return NextResponse.json({ error: "NOT_LINKED" }, { status: 400 });
      }
      const [updated] = await db
        .update(relationships)
        .set({ unlinkRequestedBy: user.id })
        .where(eq(relationships.id, currentRel.id))
        .returning();
      return NextResponse.json({ relationship: updated });
    }

    if (action === "cancel_unlink") {
      if (!currentRel || currentRel.status !== "active") {
        return NextResponse.json({ error: "NOT_LINKED" }, { status: 400 });
      }
      const [updated] = await db
        .update(relationships)
        .set({ unlinkRequestedBy: null })
        .where(eq(relationships.id, currentRel.id))
        .returning();
      return NextResponse.json({ relationship: updated });
    }

    if (action === "confirm_unlink") {
      if (!currentRel || currentRel.status !== "active") {
        return NextResponse.json({ error: "NOT_LINKED" }, { status: 400 });
      }
      const [updated] = await db
        .update(relationships)
        .set({ status: "unlinked", unlinkRequestedBy: user.id })
        .where(eq(relationships.id, currentRel.id))
        .returning();
      return NextResponse.json({ relationship: updated });
    }

    return NextResponse.json({ error: "INVALID_ACTION" }, { status: 400 });
  } catch (err) {
    console.error("Relationship API error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
