import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

const rateMap = new Map<string, { count: number; reset: number }>();

function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || entry.reset < now) {
    rateMap.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 60) return false;
  entry.count++;
  return true;
}

function hashIp(ip: string): string {
  return createHash("sha256").update(ip + env.ipHashSalt()).digest("hex");
}

const BOT_RE = /bot|crawler|spider/i;

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRate(ip)) {
    return NextResponse.json({ error: "Rate limit" }, { status: 429 });
  }

  const ua = request.headers.get("user-agent") ?? "";
  if (BOT_RE.test(ua)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const body = await request.json();
  const eventType = String(body.eventType ?? "");
  const partnerId = body.partnerId != null ? Number(body.partnerId) : null;
  const sessionId = body.sessionId ? String(body.sessionId) : null;

  const allowed = [
    "page_open",
    "click_discount",
    "click_uds",
    "click_telegram",
    "click_max",
    "click_call",
    "click_catalog",
    "click_catalog_telegram",
    "click_catalog_max",
    "click_catalog_uds",
    "click_catalog_uds_app",
    "click_catalog_website",
    "click_route",
    "click_yandex_maps",
    "click_yandex_navigator",
    "click_2gis",
    "click_google_maps",
    "click_schedule",
  ];
  if (!allowed.includes(eventType)) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  if (eventType === "page_open" && sessionId) {
    const since = new Date(Date.now() - 30 * 60 * 1000);
    const existing = await prisma.visitEvent.findFirst({
      where: {
        eventType: "page_open",
        sessionId,
        partnerId,
        createdAt: { gte: since },
      },
    });
    if (existing) return NextResponse.json({ ok: true, deduped: true });
  }

  if (eventType === "click_discount" && sessionId) {
    const existing = await prisma.visitEvent.findFirst({
      where: { eventType: "click_discount", sessionId, partnerId },
    });
    if (existing) return NextResponse.json({ ok: true, deduped: true });
  }

  await prisma.visitEvent.create({
    data: {
      eventType,
      partnerId,
      sessionId,
      userAgent: ua.slice(0, 500),
      ipHash: hashIp(ip),
    },
  });

  return NextResponse.json({ ok: true });
}
