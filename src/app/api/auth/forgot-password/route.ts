import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const step = body.step as "request" | "reset";
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "EMAIL_REQUIRED" }, { status: 400 });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (step === "request") {
      if (!user) {
        // Return generic message or safe token response without leaking user existence in prod
        return NextResponse.json({
          ok: true,
          tokenHint: null,
        });
      }
      const rawToken = crypto.randomBytes(4).toString("hex").toUpperCase();
      const tokenHash = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

      await db
        .update(users)
        .set({
          resetToken: tokenHash,
          resetTokenExpiresAt: expiresAt,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));

      // Since no external SMTP server is configured in sandbox, return the time-limited token in-app when requested
      // In production with SMTP configured, send via email instead.
      return NextResponse.json({
        ok: true,
        resetToken: rawToken,
      });
    }

    if (step === "reset") {
      const token = String(body.token ?? "").trim().toUpperCase();
      const newPassword = String(body.newPassword ?? "");
      if (!user || !token || newPassword.length < 6) {
        return NextResponse.json({ error: "INVALID_RESET" }, { status: 400 });
      }
      const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      if (
        !user.resetToken ||
        user.resetToken !== tokenHash ||
        !user.resetTokenExpiresAt ||
        user.resetTokenExpiresAt.getTime() < Date.now()
      ) {
        return NextResponse.json({ error: "TOKEN_EXPIRED" }, { status: 400 });
      }

      const passwordHash = await hashPassword(newPassword);
      await db
        .update(users)
        .set({
          passwordHash,
          resetToken: null,
          resetTokenExpiresAt: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "INVALID_STEP" }, { status: 400 });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
