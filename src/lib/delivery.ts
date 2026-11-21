import * as webpush from "web-push";
import { db } from "@/db";
import {
  drafts,
  letters,
  notifications,
  pushSubscriptions,
  relationships,
  users,
} from "@/db/schema";
import { and, eq, lte, sql } from "drizzle-orm";

export type DeliveryPreset =
  | "instant"
  | "5m"
  | "30m"
  | "1h"
  | "6h"
  | "12h"
  | "24h"
  | "custom";

export function computeServerDeliveryAt(
  baseTime: Date,
  preset: DeliveryPreset,
  customIso?: string | null
): Date {
  const msMap: Record<Exclude<DeliveryPreset, "custom">, number> = {
    instant: 0,
    "5m": 5 * 60 * 1000,
    "30m": 30 * 60 * 1000,
    "1h": 60 * 60 * 1000,
    "6h": 6 * 60 * 60 * 1000,
    "12h": 12 * 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
  };

  if (preset === "custom" && customIso) {
    const parsed = new Date(customIso);
    if (!Number.isNaN(parsed.getTime()) && parsed.getTime() > baseTime.getTime()) {
      return parsed;
    }
  }
  const offset = preset === "custom" ? 0 : (msMap[preset] ?? 0);
  return new Date(baseTime.getTime() + offset);
}

function configureWebPush(): boolean {
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:desk@betweenletters.app";
  if (!pub || !priv) return false;
  webpush.setVapidDetails(subject, pub, priv);
  return true;
}

async function dispatchWebPushForNotification(
  userId: string,
  messageKey: string
) {
  if (!configureWebPush()) return;

  const [targetUser] = await db
    .select({
      notificationsEnabled: users.notificationsEnabled,
      preferredLanguage: users.preferredLanguage,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!targetUser || !targetUser.notificationsEnabled) return;

  const subs = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId));

  if (subs.length === 0) return;

  const lang = targetUser.preferredLanguage;
  const title =
    lang === "ar"
      ? "بين الرسائل"
      : "Between Letters";
  const body =
    messageKey === "delayed"
      ? lang === "ar"
        ? "شخص ما خصّص لك بعض الكلمات."
        : lang === "fr"
          ? "Quelqu'un vous a écrit quelques mots."
          : "Someone set aside a few words for you."
      : lang === "ar"
        ? "لديك رسالة جديدة..."
        : lang === "fr"
          ? "Vous avez une nouvelle lettre..."
          : "You have a new letter...";

  const payload = JSON.stringify({
    title,
    body,
    url: "/inbox",
  });

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload
        );
      } catch (err: unknown) {
        const statusCode =
          typeof err === "object" && err !== null && "statusCode" in err
            ? (err as { statusCode: number }).statusCode
            : 0;
        if (statusCode === 404 || statusCode === 410) {
          await db
            .delete(pushSubscriptions)
            .where(eq(pushSubscriptions.id, sub.id));
        }
      }
    })
  );
}

/**
 * Server-authoritative mail delivery processor.
 * 1) Promotes scheduled drafts whose scheduledSendAt <= NOW() into real letters.
 * 2) Delivers in_transit letters whose deliveryAt <= NOW() and creates deduplicated notifications.
 */
export async function processPendingMail() {
  const now = new Date();

  // Step 1: Promote due scheduled-send drafts inside transactions
  const dueDrafts = await db
    .select()
    .from(drafts)
    .where(
      and(
        eq(drafts.isScheduledSend, true),
        lte(drafts.scheduledSendAt, now)
      )
    );

  for (const draft of dueDrafts) {
    if (!draft.relationshipId) continue;

    await db.transaction(async (tx) => {
      // Lock check by deleting the scheduled draft first atomically
      const deleted = await tx
        .delete(drafts)
        .where(
          and(eq(drafts.id, draft.id), eq(drafts.isScheduledSend, true))
        )
        .returning({ id: drafts.id });

      if (deleted.length === 0) return;

      const [rel] = await tx
        .select()
        .from(relationships)
        .where(
          and(
            eq(relationships.id, draft.relationshipId!),
            eq(relationships.status, "active")
          )
        )
        .limit(1);

      if (!rel || !rel.userTwoId) return;

      const receiverId =
        rel.userOneId === draft.senderId ? rel.userTwoId : rel.userOneId;
      const ds = draft.designSettings;
      const sendTime = draft.scheduledSendAt ?? now;
      const deliveryAt = computeServerDeliveryAt(
        sendTime,
        ds.deliveryPreset,
        ds.customDeliveryIso
      );

      await tx.insert(letters).values({
        relationshipId: rel.id,
        senderId: draft.senderId,
        receiverId,
        content: draft.content,
        handwritingImage: draft.handwritingImage,
        paperDesign: ds.paperDesign,
        envelopeDesign: ds.envelopeDesign,
        stampDesign: ds.stampDesign,
        waxSealDesign: ds.waxSealDesign,
        recipientLabel: ds.recipientLabel || "إليك",
        symbolicAddress: ds.symbolicAddress || "",
        envelopeNote: ds.envelopeNote || "",
        fontFamily: ds.fontFamily,
        fontSize: ds.fontSize,
        inkColor: ds.inkColor,
        language: ds.language,
        direction: ds.direction,
        deliveryPreset: ds.deliveryPreset,
        scheduleMode: "scheduled_send",
        specialOccasionLabel: ds.specialOccasionLabel || "",
        sentAt: sendTime,
        scheduledSendAt: draft.scheduledSendAt,
        deliveryAt,
        status: "in_transit",
      });
    });
  }

  // Step 2: Deliver in_transit letters whose server deliveryAt <= NOW()
  const newlyDelivered = await db
    .update(letters)
    .set({
      status: "delivered",
      deliveredAt: sql`NOW()`,
    })
    .where(
      and(
        eq(letters.status, "in_transit"),
        lte(letters.deliveryAt, sql`NOW()`)
      )
    )
    .returning({
      id: letters.id,
      receiverId: letters.receiverId,
      deliveryPreset: letters.deliveryPreset,
      scheduleMode: letters.scheduleMode,
    });

  for (const letter of newlyDelivered) {
    const isDelayed =
      letter.deliveryPreset !== "instant" ||
      letter.scheduleMode !== "immediate_send";
    const type = isDelayed ? "delayed_letter_arrived" : "letter_arrived";
    const messageKey = isDelayed ? "delayed" : "instant";

    const inserted = await db
      .insert(notifications)
      .values({
        userId: letter.receiverId,
        letterId: letter.id,
        type,
        messageKey,
      })
      .onConflictDoNothing()
      .returning({ id: notifications.id });

    if (inserted.length > 0) {
      // Fire-and-forget Web Push (never reveals content)
      dispatchWebPushForNotification(letter.receiverId, messageKey).catch(
        () => {}
      );
    }
  }
}
