import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, setSessionCookie, sanitizePlainText } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const displayName = sanitizePlainText(String(body.displayName ?? "").trim(), 80);
    const nickname = sanitizePlainText(String(body.nickname ?? "").trim(), 60);
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const preferredLanguage = ["ar", "en", "fr"].includes(body.preferredLanguage)
      ? body.preferredLanguage
      : "ar";

    if (!displayName || !email || password.length < 6) {
      return NextResponse.json(
        { error: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing) {
      return NextResponse.json({ error: "EMAIL_EXISTS" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const [created] = await db
      .insert(users)
      .values({
        displayName,
        nickname: nickname || displayName,
        email,
        passwordHash,
        preferredLanguage,
      })
      .returning({
        id: users.id,
        displayName: users.displayName,
        nickname: users.nickname,
        email: users.email,
        preferredLanguage: users.preferredLanguage,
      });

    await setSessionCookie(created.id);
    return NextResponse.json({ user: created }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
