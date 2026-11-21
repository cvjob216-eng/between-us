import { NextResponse } from "next/server";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { and, desc, eq, isNull } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { processPendingMail } from "@/lib/delivery";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    await processPendingMail();

    const list = await db
      .select({
        id: notifications.id,
        type: notifications.type,
        messageKey: notifications.messageKey,
        letterId: notifications.letterId,
        sentAt: notifications.sentAt,
        readAt: notifications.readAt,
      })
      .from(notifications)
      .where(eq(notifications.userId, user.id))
      .orderBy(desc(notifications.sentAt))
      .limit(30);

    return NextResponse.json({ notifications: list });
  } catch (err) {
    console.error("Notifications error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await req.json();
    const now = new Date();

    if (body.markAllRead) {
      await db
        .update(notifications)
        .set({ readAt: now })
        .where(
          and(eq(notifications.userId, user.id), isNull(notifications.readAt))
        );
    } else if (typeof body.id === "string") {
      await db
        .update(notifications)
        .set({ readAt: now })
        .where(
          and(
            eq(notifications.id, body.id),
            eq(notifications.userId, user.id)
          )
        );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Mark notifications error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
