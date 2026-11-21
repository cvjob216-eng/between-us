import { NextResponse } from "next/server";
import { db } from "@/db";
import { letters, notifications } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentUser, getUserRelationship } from "@/lib/auth";
import { processPendingMail } from "@/lib/delivery";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    await processPendingMail();

    const { id } = await context.params;
    const rel = await getUserRelationship(user.id);
    if (!rel) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const [letter] = await db
      .select()
      .from(letters)
      .where(and(eq(letters.id, id), eq(letters.relationshipId, rel.id)))
      .limit(1);

    if (!letter) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    if (letter.senderId !== user.id && letter.receiverId !== user.id) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const now = new Date();
    const isSender = letter.senderId === user.id;
    const isLocked = !isSender && now < letter.deliveryAt;
    const isFavorite = rel.isUserOne
      ? letter.isFavoriteByOne
      : letter.isFavoriteByTwo;
    const partnerName =
      rel.partner?.nickname || rel.partner?.displayName || "";
    const myName = user.nickname || user.displayName;

    // Never return content if locked OR if receiver hasn't broken the seal yet (except when calling POST open)!
    // Wait: if status is already 'opened' or requester is sender, return full content.
    // If status is 'delivered' and requester is receiver, return envelope metadata & allow breaking seal via POST action="open"!
    const canViewContent =
      !isLocked && (isSender || letter.status === "opened");

    return NextResponse.json({
      letter: {
        id: letter.id,
        senderId: letter.senderId,
        receiverId: letter.receiverId,
        senderName: isSender ? myName : partnerName,
        receiverName: isSender ? partnerName : myName,
        isSender,
        paperDesign: letter.paperDesign,
        envelopeDesign: letter.envelopeDesign,
        stampDesign: letter.stampDesign,
        waxSealDesign: letter.waxSealDesign,
        recipientLabel: letter.recipientLabel,
        symbolicAddress: letter.symbolicAddress,
        envelopeNote: letter.envelopeNote,
        fontFamily: letter.fontFamily,
        fontSize: letter.fontSize,
        inkColor: letter.inkColor,
        language: letter.language,
        direction: letter.direction,
        specialOccasionLabel: letter.specialOccasionLabel,
        sentAt: letter.sentAt,
        deliveryAt: letter.deliveryAt,
        deliveredAt: letter.deliveredAt,
        openedAt: letter.openedAt,
        status: letter.status,
        isLocked,
        isFavorite,
        content: canViewContent ? letter.content : null,
        handwritingImage: canViewContent ? letter.handwritingImage : null,
      },
      serverNow: now.toISOString(),
    });
  } catch (err) {
    console.error("Get single letter error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    await processPendingMail();

    const { id } = await context.params;
    const rel = await getUserRelationship(user.id);
    if (!rel) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const [letter] = await db
      .select()
      .from(letters)
      .where(and(eq(letters.id, id), eq(letters.relationshipId, rel.id)))
      .limit(1);

    if (!letter) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    if (letter.senderId !== user.id && letter.receiverId !== user.id) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const body = await req.json();
    const action = body.action as "open" | "toggle_favorite";
    const now = new Date();

    if (action === "open") {
      if (letter.receiverId !== user.id) {
        return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
      }
      if (now < letter.deliveryAt) {
        return NextResponse.json(
          { error: "STILL_IN_TRANSIT", deliveryAt: letter.deliveryAt },
          { status: 403 }
        );
      }

      let updated = letter;
      if (letter.status !== "opened") {
        const [u] = await db
          .update(letters)
          .set({
            status: "opened",
            openedAt: letter.openedAt ?? now,
            deliveredAt: letter.deliveredAt ?? now,
          })
          .where(eq(letters.id, letter.id))
          .returning();
        updated = u;

        await db
          .update(notifications)
          .set({ readAt: now })
          .where(
            and(
              eq(notifications.userId, user.id),
              eq(notifications.letterId, letter.id)
            )
          );
      }

      const partnerName =
        rel.partner?.nickname || rel.partner?.displayName || "";
      const myName = user.nickname || user.displayName;
      const isFavorite = rel.isUserOne
        ? updated.isFavoriteByOne
        : updated.isFavoriteByTwo;

      return NextResponse.json({
        letter: {
          ...updated,
          senderName: partnerName,
          receiverName: myName,
          isSender: false,
          isLocked: false,
          isFavorite,
        },
      });
    }

    if (action === "toggle_favorite") {
      const canFavorite =
        letter.senderId === user.id ||
        (now >= letter.deliveryAt && letter.status === "opened");
      if (!canFavorite) {
        return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
      }

      const currentFav = rel.isUserOne
        ? letter.isFavoriteByOne
        : letter.isFavoriteByTwo;

      const [updated] = await db
        .update(letters)
        .set(
          rel.isUserOne
            ? { isFavoriteByOne: !currentFav }
            : { isFavoriteByTwo: !currentFav }
        )
        .where(eq(letters.id, letter.id))
        .returning();

      return NextResponse.json({
        isFavorite: rel.isUserOne
          ? updated.isFavoriteByOne
          : updated.isFavoriteByTwo,
      });
    }

    return NextResponse.json({ error: "INVALID_ACTION" }, { status: 400 });
  } catch (err) {
    console.error("Letter action error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
