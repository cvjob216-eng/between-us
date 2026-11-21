import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  getCurrentUser,
  sanitizePlainText,
  validateImageDataUrl,
} from "@/lib/auth";
import { FONT_OPTIONS } from "@/lib/catalog";

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await req.json();
    const updates: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (typeof body.displayName === "string") {
      const val = sanitizePlainText(body.displayName.trim(), 80);
      if (val) updates.displayName = val;
    }

    if (typeof body.nickname === "string") {
      updates.nickname = sanitizePlainText(body.nickname.trim(), 60);
    }

    if (body.profileImage !== undefined) {
      const check = validateImageDataUrl(body.profileImage, 750_000);
      if (!check.ok) {
        return NextResponse.json({ error: check.error }, { status: 400 });
      }
      updates.profileImage = check.value;
    }

    if (
      typeof body.preferredLanguage === "string" &&
      ["ar", "en", "fr"].includes(body.preferredLanguage)
    ) {
      updates.preferredLanguage = body.preferredLanguage;
    }

    if (
      typeof body.defaultFont === "string" &&
      FONT_OPTIONS.some((f) => f.id === body.defaultFont)
    ) {
      updates.defaultFont = body.defaultFont;
    }

    if (typeof body.defaultFontSize === "number") {
      updates.defaultFontSize = Math.min(34, Math.max(14, Math.round(body.defaultFontSize)));
    }

    if (typeof body.soundEnabled === "boolean") {
      updates.soundEnabled = body.soundEnabled;
    }

    if (typeof body.notificationsEnabled === "boolean") {
      updates.notificationsEnabled = body.notificationsEnabled;
    }

    if (typeof body.privacyHideSenderOnDesk === "boolean") {
      updates.privacyHideSenderOnDesk = body.privacyHideSenderOnDesk;
    }

    const [updated] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, user.id))
      .returning({
        id: users.id,
        displayName: users.displayName,
        nickname: users.nickname,
        email: users.email,
        profileImage: users.profileImage,
        preferredLanguage: users.preferredLanguage,
        defaultFont: users.defaultFont,
        defaultFontSize: users.defaultFontSize,
        soundEnabled: users.soundEnabled,
        notificationsEnabled: users.notificationsEnabled,
        privacyHideSenderOnDesk: users.privacyHideSenderOnDesk,
      });

    return NextResponse.json({ user: updated });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
