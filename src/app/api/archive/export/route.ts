import { NextResponse } from "next/server";
import { db } from "@/db";
import { letters } from "@/db/schema";
import { and, desc, eq, or } from "drizzle-orm";
import { getCurrentUser, getUserRelationship } from "@/lib/auth";
import { processPendingMail } from "@/lib/delivery";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    await processPendingMail();
    const rel = await getUserRelationship(user.id);
    if (!rel) {
      return NextResponse.json({ error: "NOT_LINKED" }, { status: 403 });
    }

    const now = new Date();
    const rows = await db
      .select()
      .from(letters)
      .where(
        and(
          eq(letters.relationshipId, rel.id),
          or(eq(letters.senderId, user.id), eq(letters.receiverId, user.id))
        )
      )
      .orderBy(desc(letters.sentAt));

    const exportable = rows
      .filter((r) => r.senderId === user.id || (now >= r.deliveryAt && r.status === "opened"))
      .map((r) => ({
        id: r.id,
        from:
          r.senderId === user.id
            ? user.nickname || user.displayName
            : rel.partner?.nickname || rel.partner?.displayName || "Partner",
        to:
          r.receiverId === user.id
            ? user.nickname || user.displayName
            : rel.partner?.nickname || rel.partner?.displayName || "Partner",
        recipientLabel: r.recipientLabel,
        content: r.content,
        handwritingImage: r.handwritingImage,
        paperDesign: r.paperDesign,
        envelopeDesign: r.envelopeDesign,
        stampDesign: r.stampDesign,
        waxSealDesign: r.waxSealDesign,
        fontFamily: r.fontFamily,
        fontSize: r.fontSize,
        inkColor: r.inkColor,
        language: r.language,
        direction: r.direction,
        sentAt: r.sentAt,
        deliveryAt: r.deliveryAt,
        openedAt: r.openedAt,
      }));

    const payload = {
      app: "Between Letters – بين الرسائل",
      exportedAt: now.toISOString(),
      correspondents: [
        user.nickname || user.displayName,
        rel.partner?.nickname || rel.partner?.displayName || null,
      ],
      totalLetters: exportable.length,
      letters: exportable,
    };

    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="between-letters-archive-${now.toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (err) {
    console.error("Export archive error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
