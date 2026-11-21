import { NextResponse } from "next/server";
import { db } from "@/db";
import { drafts, letters, DraftDesignSettings } from "@/db/schema";
import { and, desc, eq, gte, lte, or } from "drizzle-orm";
import {
  getCurrentUser,
  getUserRelationship,
  sanitizePlainText,
  validateImageDataUrl,
} from "@/lib/auth";
import {
  computeServerDeliveryAt,
  DeliveryPreset,
  processPendingMail,
} from "@/lib/delivery";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    await processPendingMail();

    const rel = await getUserRelationship(user.id);
    if (!rel || rel.status !== "active") {
      return NextResponse.json({
        letters: [],
        scheduledDrafts: [],
        serverNow: new Date().toISOString(),
      });
    }

    const { searchParams } = new URL(req.url);
    const box = searchParams.get("box") || "inbox"; // inbox | sent | archive
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const senderFilter = searchParams.get("sender") || "all"; // all | me | partner
    const favoritesOnly = searchParams.get("favorites") === "true";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const conditions = [
      eq(letters.relationshipId, rel.id),
      or(eq(letters.senderId, user.id), eq(letters.receiverId, user.id)),
    ];

    if (box === "inbox") {
      conditions.push(eq(letters.receiverId, user.id));
    } else if (box === "sent") {
      conditions.push(eq(letters.senderId, user.id));
    } else if (box === "archive") {
      // Archive displays all letters that have been opened (or sent and delivered/opened)
      if (senderFilter === "me") {
        conditions.push(eq(letters.senderId, user.id));
      } else if (senderFilter === "partner") {
        conditions.push(eq(letters.receiverId, user.id));
      }
      if (dateFrom) {
        const d = new Date(dateFrom);
        if (!Number.isNaN(d.getTime())) conditions.push(gte(letters.sentAt, d));
      }
      if (dateTo) {
        const d = new Date(dateTo);
        if (!Number.isNaN(d.getTime())) {
          d.setHours(23, 59, 59, 999);
          conditions.push(lte(letters.sentAt, d));
        }
      }
    }

    const rows = await db
      .select()
      .from(letters)
      .where(and(...conditions))
      .orderBy(desc(letters.sentAt));

    const now = new Date();
    const partnerName =
      rel.partner?.nickname || rel.partner?.displayName || "";
    const myName = user.nickname || user.displayName;

    const mapped = rows
      .filter((row) => {
        // In archive, hide letters that are still locked for the receiver!
        if (
          box === "archive" &&
          row.receiverId === user.id &&
          (row.status === "in_transit" || now < row.deliveryAt)
        ) {
          return false;
        }
        if (box === "archive" && favoritesOnly) {
          const isFav = rel.isUserOne
            ? row.isFavoriteByOne
            : row.isFavoriteByTwo;
          if (!isFav) return false;
        }
        if (search) {
          const canSearchContent =
            row.senderId === user.id ||
            (row.status === "opened" && now >= row.deliveryAt);
          const hay = [
            row.recipientLabel,
            row.symbolicAddress,
            row.specialOccasionLabel,
            canSearchContent ? row.content : "",
          ]
            .join(" ")
            .toLowerCase();
          if (!hay.includes(search)) return false;
        }
        return true;
      })
      .map((row) => {
        const isSender = row.senderId === user.id;
        const isLocked = !isSender && (row.status === "in_transit" || now < row.deliveryAt);
        const isFavorite = rel.isUserOne
          ? row.isFavoriteByOne
          : row.isFavoriteByTwo;

        // NEVER leak content in inbox/sent list views OR if locked!
        // Archive returns content only for unlocked/opened or sender's own letters
        const includeContent =
          box === "archive" &&
          !isLocked &&
          (isSender || row.status === "opened");

        return {
          id: row.id,
          senderId: row.senderId,
          receiverId: row.receiverId,
          senderName: isSender ? myName : partnerName,
          receiverName: isSender ? partnerName : myName,
          isSender,
          paperDesign: row.paperDesign,
          envelopeDesign: row.envelopeDesign,
          stampDesign: row.stampDesign,
          waxSealDesign: row.waxSealDesign,
          recipientLabel: row.recipientLabel,
          symbolicAddress: row.symbolicAddress,
          envelopeNote: row.envelopeNote,
          fontFamily: row.fontFamily,
          fontSize: row.fontSize,
          inkColor: row.inkColor,
          language: row.language,
          direction: row.direction,
          deliveryPreset: row.deliveryPreset,
          scheduleMode: row.scheduleMode,
          specialOccasionLabel: row.specialOccasionLabel,
          sentAt: row.sentAt,
          deliveryAt: row.deliveryAt,
          deliveredAt: row.deliveredAt,
          openedAt: row.openedAt,
          status: row.status,
          isLocked,
          isFavorite,
          content: includeContent ? row.content : null,
          handwritingImage: includeContent ? row.handwritingImage : null,
        };
      });

    let scheduledDrafts: Array<{
      id: string;
      recipientLabel: string;
      envelopeDesign: string;
      stampDesign: string;
      waxSealDesign: string;
      scheduledSendAt: Date | null;
      specialOccasionLabel: string;
    }> = [];

    if (box === "sent") {
      const sd = await db
        .select()
        .from(drafts)
        .where(
          and(eq(drafts.senderId, user.id), eq(drafts.isScheduledSend, true))
        )
        .orderBy(desc(drafts.scheduledSendAt));
      scheduledDrafts = sd.map((d) => ({
        id: d.id,
        recipientLabel: d.designSettings.recipientLabel || partnerName,
        envelopeDesign: d.designSettings.envelopeDesign,
        stampDesign: d.designSettings.stampDesign,
        waxSealDesign: d.designSettings.waxSealDesign,
        scheduledSendAt: d.scheduledSendAt,
        specialOccasionLabel: d.designSettings.specialOccasionLabel || "",
      }));
    }

    return NextResponse.json({
      letters: mapped,
      scheduledDrafts,
      serverNow: now.toISOString(),
    });
  } catch (err) {
    console.error("Get letters error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const rel = await getUserRelationship(user.id);
    if (!rel || rel.status !== "active" || !rel.userTwoId) {
      return NextResponse.json({ error: "NOT_LINKED" }, { status: 403 });
    }

    const receiverId =
      rel.userOneId === user.id ? rel.userTwoId : rel.userOneId;

    const body = await req.json();
    const content = sanitizePlainText(String(body.content ?? ""), 30000);
    const imgCheck = validateImageDataUrl(body.handwritingImage, 1_500_000);
    if (!imgCheck.ok) {
      return NextResponse.json({ error: imgCheck.error }, { status: 400 });
    }

    if (!content.trim() && !imgCheck.value) {
      return NextResponse.json({ error: "EMPTY_LETTER" }, { status: 400 });
    }

    const scheduleMode = (
      ["immediate_send", "scheduled_send", "delayed_arrival"].includes(
        body.scheduleMode
      )
        ? body.scheduleMode
        : "immediate_send"
    ) as "immediate_send" | "scheduled_send" | "delayed_arrival";

    const deliveryPreset = (
      ["instant", "5m", "30m", "1h", "6h", "12h", "24h", "custom"].includes(
        body.deliveryPreset
      )
        ? body.deliveryPreset
        : "instant"
    ) as DeliveryPreset;

    const customDeliveryIso =
      typeof body.customDeliveryIso === "string" ? body.customDeliveryIso : null;

    const designSettings: DraftDesignSettings = {
      paperDesign: String(body.paperDesign || "antique_ivory"),
      envelopeDesign: String(body.envelopeDesign || "classic_ivory"),
      stampDesign: String(body.stampDesign || "pressed_rose"),
      waxSealDesign: String(body.waxSealDesign || "burgundy_heart"),
      recipientLabel: sanitizePlainText(
        String(body.recipientLabel || rel.partner?.nickname || rel.partner?.displayName || ""),
        80
      ),
      symbolicAddress: sanitizePlainText(String(body.symbolicAddress || ""), 120),
      envelopeNote: sanitizePlainText(String(body.envelopeNote || ""), 120),
      fontFamily: String(body.fontFamily || user.defaultFont || "amiri"),
      fontSize: Math.min(34, Math.max(14, Number(body.fontSize) || 20)),
      inkColor: String(body.inkColor || "#35271F"),
      language: (["ar", "en", "fr"].includes(body.language)
        ? body.language
        : "ar") as "ar" | "en" | "fr",
      direction: body.direction === "ltr" ? "ltr" : "rtl",
      deliveryPreset,
      scheduleMode,
      customDeliveryIso: customDeliveryIso || "",
      specialOccasionLabel: sanitizePlainText(
        String(body.specialOccasionLabel || ""),
        120
      ),
    };

    const now = new Date();

    // Case 1: Scheduled-send letter stays in drafts until scheduledSendAt!
    if (scheduleMode === "scheduled_send") {
      const target = customDeliveryIso ? new Date(customDeliveryIso) : null;
      if (!target || Number.isNaN(target.getTime()) || target <= now) {
        return NextResponse.json(
          { error: "INVALID_SCHEDULE_DATE" },
          { status: 400 }
        );
      }

      const [scheduledDraft] = await db
        .insert(drafts)
        .values({
          senderId: user.id,
          relationshipId: rel.id,
          content,
          handwritingImage: imgCheck.value,
          designSettings: {
            ...designSettings,
            deliveryPreset: "instant",
          },
          isScheduledSend: true,
          scheduledSendAt: target,
        })
        .returning();

      // Clear active working draft
      await db
        .delete(drafts)
        .where(
          and(eq(drafts.senderId, user.id), eq(drafts.isScheduledSend, false))
        );

      return NextResponse.json(
        {
          scheduled: true,
          draft: scheduledDraft,
        },
        { status: 201 }
      );
    }

    // Case 2: Immediate send or delayed arrival
    const effectivePreset: DeliveryPreset =
      scheduleMode === "delayed_arrival" && deliveryPreset === "instant"
        ? "custom"
        : deliveryPreset;

    const deliveryAt = computeServerDeliveryAt(
      now,
      effectivePreset,
      customDeliveryIso
    );

    const [created] = await db
      .insert(letters)
      .values({
        relationshipId: rel.id,
        senderId: user.id,
        receiverId,
        content,
        handwritingImage: imgCheck.value,
        paperDesign: designSettings.paperDesign,
        envelopeDesign: designSettings.envelopeDesign,
        stampDesign: designSettings.stampDesign,
        waxSealDesign: designSettings.waxSealDesign,
        recipientLabel: designSettings.recipientLabel || "إليك",
        symbolicAddress: designSettings.symbolicAddress,
        envelopeNote: designSettings.envelopeNote,
        fontFamily: designSettings.fontFamily,
        fontSize: designSettings.fontSize,
        inkColor: designSettings.inkColor,
        language: designSettings.language,
        direction: designSettings.direction,
        deliveryPreset: effectivePreset,
        scheduleMode,
        specialOccasionLabel: designSettings.specialOccasionLabel,
        sentAt: now,
        deliveryAt,
        status: "in_transit",
      })
      .returning();

    // Clear active working draft
    await db
      .delete(drafts)
      .where(
        and(eq(drafts.senderId, user.id), eq(drafts.isScheduledSend, false))
      );

    // Run delivery processor immediately (delivers instant letters & sends notification)
    await processPendingMail();

    return NextResponse.json(
      {
        scheduled: false,
        letterId: created.id,
        deliveryAt: created.deliveryAt,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Send letter error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
