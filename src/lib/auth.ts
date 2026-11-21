import { cookies, headers } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "@/db";
import { users, relationships } from "@/db/schema";
import { and, eq, or } from "drizzle-orm";

const COOKIE_NAME = "bl_session";

function getJwtSecret(): Uint8Array {
  const secret =
    process.env.AUTH_SECRET ||
    process.env.DATABASE_URL ||
    "between-letters-local-dev-secret-change-me";
  const derived = crypto.createHash("sha256").update(secret).digest("hex");
  return new TextEncoder().encode(derived);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getJwtSecret());
}

export async function setSessionCookie(userId: string): Promise<void> {
  const token = await createSessionToken(userId);
  const cookieStore = await cookies();
  const hdrs = await headers();
  const proto = hdrs.get("x-forwarded-proto") || "http";
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: proto === "https",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return null;
  return {
    id: user.id,
    displayName: user.displayName,
    nickname: user.nickname,
    email: user.email,
    profileImage: user.profileImage,
    preferredLanguage: user.preferredLanguage as "ar" | "en" | "fr",
    defaultFont: user.defaultFont,
    defaultFontSize: user.defaultFontSize,
    soundEnabled: user.soundEnabled,
    notificationsEnabled: user.notificationsEnabled,
    privacyHideSenderOnDesk: user.privacyHideSenderOnDesk,
    createdAt: user.createdAt,
  };
}

export async function getUserRelationship(userId: string) {
  const [rel] = await db
    .select()
    .from(relationships)
    .where(
      and(
        or(
          eq(relationships.userOneId, userId),
          eq(relationships.userTwoId, userId)
        ),
        or(
          eq(relationships.status, "active"),
          eq(relationships.status, "pending")
        )
      )
    )
    .limit(1);

  if (!rel) return null;

  const partnerId =
    rel.userOneId === userId ? rel.userTwoId : rel.userOneId;

  let partner = null;
  if (partnerId) {
    const [p] = await db
      .select({
        id: users.id,
        displayName: users.displayName,
        nickname: users.nickname,
        profileImage: users.profileImage,
      })
      .from(users)
      .where(eq(users.id, partnerId))
      .limit(1);
    partner = p ?? null;
  }

  return {
    ...rel,
    partner,
    isUserOne: rel.userOneId === userId,
  };
}

export function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = (len: number) =>
    Array.from(
      { length: len },
      () => chars[crypto.randomInt(0, chars.length)]
    ).join("");
  return `BL-${part(4)}-${part(4)}`;
}

export function validateImageDataUrl(
  dataUrl: string | null | undefined,
  maxBytes = 750_000
): { ok: true; value: string | null } | { ok: false; error: string } {
  if (!dataUrl) return { ok: true, value: null };
  if (typeof dataUrl !== "string") {
    return { ok: false, error: "Invalid image format" };
  }
  const match = dataUrl.match(/^data:image\/(png|jpeg|jpg|webp);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) {
    return { ok: false, error: "Only PNG, JPEG, or WebP images are permitted" };
  }
  const base64Data = match[2];
  const approxBytes = Math.floor((base64Data.length * 3) / 4);
  if (approxBytes > maxBytes) {
    return { ok: false, error: "Image exceeds maximum allowed size" };
  }
  return { ok: true, value: dataUrl };
}

export function sanitizePlainText(input: string, maxLen = 25000): string {
  return input
    .replace(/\u0000/g, "")
    .slice(0, maxLen);
}
