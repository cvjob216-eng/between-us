import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export interface DraftDesignSettings {
  paperDesign: string;
  envelopeDesign: string;
  stampDesign: string;
  waxSealDesign: string;
  recipientLabel: string;
  symbolicAddress: string;
  envelopeNote: string;
  fontFamily: string;
  fontSize: number;
  inkColor: string;
  language: "ar" | "en" | "fr";
  direction: "rtl" | "ltr";
  deliveryPreset:
    | "instant"
    | "5m"
    | "30m"
    | "1h"
    | "6h"
    | "12h"
    | "24h"
    | "custom";
  scheduleMode: "immediate_send" | "scheduled_send" | "delayed_arrival";
  customDeliveryIso: string;
  specialOccasionLabel: string;
}

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  displayName: text("display_name").notNull(),
  nickname: text("nickname").notNull().default(""),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  profileImage: text("profile_image"),
  preferredLanguage: text("preferred_language").notNull().default("ar"),
  defaultFont: text("default_font").notNull().default("amiri"),
  defaultFontSize: integer("default_font_size").notNull().default(20),
  soundEnabled: boolean("sound_enabled").notNull().default(true),
  notificationsEnabled: boolean("notifications_enabled").notNull().default(true),
  privacyHideSenderOnDesk: boolean("privacy_hide_sender_on_desk")
    .notNull()
    .default(false),
  resetToken: text("reset_token"),
  resetTokenExpiresAt: timestamp("reset_token_expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const relationships = pgTable(
  "relationships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userOneId: uuid("user_one_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    userTwoId: uuid("user_two_id").references(() => users.id, {
      onDelete: "set null",
    }),
    inviteCode: text("invite_code").notNull().unique(),
    status: text("status").notNull().default("pending"), // 'pending' | 'active' | 'unlinked'
    unlinkRequestedBy: uuid("unlink_requested_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    linkedAt: timestamp("linked_at", { withTimezone: true }),
  },
  (table) => [
    index("relationships_user_one_idx").on(table.userOneId),
    index("relationships_user_two_idx").on(table.userTwoId),
  ]
);

export const letters = pgTable(
  "letters",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    relationshipId: uuid("relationship_id")
      .notNull()
      .references(() => relationships.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    receiverId: uuid("receiver_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    handwritingImage: text("handwriting_image"),
    paperDesign: text("paper_design").notNull().default("antique_ivory"),
    envelopeDesign: text("envelope_design").notNull().default("classic_ivory"),
    stampDesign: text("stamp_design").notNull().default("pressed_rose"),
    waxSealDesign: text("wax_seal_design").notNull().default("burgundy_heart"),
    recipientLabel: text("recipient_label").notNull(),
    symbolicAddress: text("symbolic_address").notNull().default(""),
    envelopeNote: text("envelope_note").notNull().default(""),
    fontFamily: text("font_family").notNull().default("amiri"),
    fontSize: integer("font_size").notNull().default(20),
    inkColor: text("ink_color").notNull().default("#35271F"),
    language: text("language").notNull().default("ar"),
    direction: text("direction").notNull().default("rtl"),
    deliveryPreset: text("delivery_preset").notNull().default("instant"),
    scheduleMode: text("schedule_mode").notNull().default("immediate_send"),
    specialOccasionLabel: text("special_occasion_label").notNull().default(""),
    sentAt: timestamp("sent_at", { withTimezone: true }).defaultNow().notNull(),
    scheduledSendAt: timestamp("scheduled_send_at", { withTimezone: true }),
    deliveryAt: timestamp("delivery_at", { withTimezone: true }).notNull(),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    openedAt: timestamp("opened_at", { withTimezone: true }),
    status: text("status").notNull().default("in_transit"), // 'in_transit' | 'delivered' | 'opened'
    isFavoriteByOne: boolean("is_favorite_by_one").notNull().default(false),
    isFavoriteByTwo: boolean("is_favorite_by_two").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("letters_relationship_idx").on(table.relationshipId),
    index("letters_receiver_status_idx").on(table.receiverId, table.status),
    index("letters_delivery_at_idx").on(table.deliveryAt),
  ]
);

export const drafts = pgTable(
  "drafts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    relationshipId: uuid("relationship_id").references(() => relationships.id, {
      onDelete: "set null",
    }),
    content: text("content").notNull().default(""),
    handwritingImage: text("handwriting_image"),
    designSettings: jsonb("design_settings").$type<DraftDesignSettings>().notNull(),
    isScheduledSend: boolean("is_scheduled_send").notNull().default(false),
    scheduledSendAt: timestamp("scheduled_send_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("drafts_sender_idx").on(table.senderId)]
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    letterId: uuid("letter_id").references(() => letters.id, {
      onDelete: "cascade",
    }),
    type: text("type").notNull(), // 'letter_arrived' | 'delayed_letter_arrived' | 'partner_linked'
    messageKey: text("message_key").notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }).defaultNow().notNull(),
    readAt: timestamp("read_at", { withTimezone: true }),
    pushDispatched: boolean("push_dispatched").notNull().default(false),
  },
  (table) => [
    uniqueIndex("notifications_unique_letter_type").on(
      table.userId,
      table.letterId,
      table.type
    ),
    index("notifications_user_idx").on(table.userId),
  ]
);

export const pushSubscriptions = pgTable(
  "push_subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    endpoint: text("endpoint").notNull().unique(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("push_subscriptions_user_idx").on(table.userId)]
);
