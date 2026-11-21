import { NextResponse } from "next/server";
import { db } from "@/db";
import { pushSubscriptions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await req.json();
    const endpoint = String(body.endpoint ?? "");
    const p256dh = String(body.keys?.p256dh ?? "");
    const auth = String(body.keys?.auth ?? "");

    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json({ error: "INVALID_SUBSCRIPTION" }, { status: 400 });
    }

    await db
      .insert(pushSubscriptions)
      .values({
        userId: user.id,
        endpoint,
        p256dh,
        auth,
      })
      .onConflictDoUpdate({
        target: pushSubscriptions.endpoint,
        set: { userId: user.id, p256dh, auth },
      });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Push subscribe error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await req.json();
    const endpoint = String(body.endpoint ?? "");
    if (endpoint) {
      await db
        .delete(pushSubscriptions)
        .where(
          and(
            eq(pushSubscriptions.userId, user.id),
            eq(pushSubscriptions.endpoint, endpoint)
          )
        );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Push unsubscribe error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
