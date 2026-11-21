import { NextResponse } from "next/server";
import { db } from "@/db";
import { drafts, DraftDesignSettings } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import {
  getCurrentUser,
  getUserRelationship,
  sanitizePlainText,
  validateImageDataUrl,
} from "@/lib/auth";
import { processPendingMail } from "@/lib/delivery";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    await processPendingMail();

    const userDrafts = await db
      .select()
      .from(drafts)
      .where(eq(drafts.senderId, user.id))
      .orderBy(desc(drafts.updatedAt));

    const workingDraft =
      userDrafts.find((d) => !d.isScheduledSend) ?? null;
    const scheduledDrafts = userDrafts.filter((d) => d.isScheduledSend);

    return NextResponse.json({
      workingDraft,
      scheduledDrafts,
    });
  } catch (err) {
    console.error("Get drafts error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const rel = await getUserRelationship(user.id);
    const body = await req.json();
    const content = sanitizePlainText(String(body.content ?? ""), 30000);
    const imgCheck = validateImageDataUrl(body.handwritingImage, 1_500_000);
    if (!imgCheck.ok) {
      return NextResponse.json({ error: imgCheck.error }, { status: 400 });
    }

    const designSettings = (body.designSettings ?? {}) as DraftDesignSettings;

    const [existing] = await db
      .select()
      .from(drafts)
      .where(
        and(eq(drafts.senderId, user.id), eq(drafts.isScheduledSend, false))
      )
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(drafts)
        .set({
          content,
          handwritingImage: imgCheck.value,
          designSettings,
          relationshipId: rel?.id ?? null,
          updatedAt: new Date(),
        })
        .where(eq(drafts.id, existing.id))
        .returning();
      return NextResponse.json({ draft: updated });
    }

    const [created] = await db
      .insert(drafts)
      .values({
        senderId: user.id,
        relationshipId: rel?.id ?? null,
        content,
        handwritingImage: imgCheck.value,
        designSettings,
        isScheduledSend: false,
      })
      .returning();

    return NextResponse.json({ draft: created });
  } catch (err) {
    console.error("Save draft error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const draftId = searchParams.get("id");

    if (draftId) {
      await db
        .delete(drafts)
        .where(and(eq(drafts.id, draftId), eq(drafts.senderId, user.id)));
    } else {
      await db
        .delete(drafts)
        .where(
          and(eq(drafts.senderId, user.id), eq(drafts.isScheduledSend, false))
        );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete draft error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
