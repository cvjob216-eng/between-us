import { NextResponse } from "next/server";
import { processPendingMail } from "@/lib/delivery";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function handleDispatch(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  const isCronAuthorized =
    cronSecret && authHeader === `Bearer ${cronSecret}`;

  if (!isCronAuthorized) {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
  }

  await processPendingMail();
  return NextResponse.json({ ok: true, processedAt: new Date().toISOString() });
}

export async function GET(req: Request) {
  return handleDispatch(req);
}

export async function POST(req: Request) {
  return handleDispatch(req);
}
