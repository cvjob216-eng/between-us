import { NextResponse } from "next/server";
import { getCurrentUser, getUserRelationship } from "@/lib/auth";
import { processPendingMail } from "@/lib/delivery";
import { db } from "@/db";
import { letters, notifications, drafts } from "@/db/schema";
import { and, eq, isNull, count } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    await processPendingMail();

    const relationship = await getUserRelationship(user.id);

    const [{ value: unreadNotifs }] = await db
      .select({ value: count() })
      .from(notifications)
      .where(
        and(eq(notifications.userId, user.id), isNull(notifications.readAt))
      );

    let unopenedCount = 0;
    let inTransitIncomingCount = 0;
    let draftsCount = 0;

    if (relationship && relationship.status === "active") {
      const [{ value: unopened }] = await db
        .select({ value: count() })
        .from(letters)
        .where(
          and(
            eq(letters.relationshipId, relationship.id),
            eq(letters.receiverId, user.id),
            eq(letters.status, "delivered")
          )
        );
      unopenedCount = unopened;

      const [{ value: transit }] = await db
        .select({ value: count() })
        .from(letters)
        .where(
          and(
            eq(letters.relationshipId, relationship.id),
            eq(letters.receiverId, user.id),
            eq(letters.status, "in_transit")
          )
        );
      inTransitIncomingCount = transit;
    }

    const [{ value: dc }] = await db
      .select({ value: count() })
      .from(drafts)
      .where(eq(drafts.senderId, user.id));
    draftsCount = dc;

    return NextResponse.json({
      user,
      relationship,
      counts: {
        unreadNotifications: unreadNotifs,
        unopenedLetters: unopenedCount,
        inTransitIncoming: inTransitIncomingCount,
        drafts: draftsCount,
      },
      serverNow: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Auth me error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
