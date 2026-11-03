import { createHash } from "crypto";
import { NextResponse } from "next/server";
import {
  appendAnalyticsEvent,
  useAnalyticsBlob,
  type AnalyticsSite,
  type DeviceType,
} from "@/lib/analytics-blob";
import { persistDbToBlob } from "@/lib/db-persist";
import { ensureDbReady } from "@/lib/ensure-db";
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
const MAIN_SITE_ORIGINS = new Set([
  "https://eco-next-three.vercel.app",
  "https://econext.ru",
  "https://www.econext.ru",
]);

function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get("origin") ?? "";
  if (!MAIN_SITE_ORIGINS.has(origin)) return { Vary: "Origin" };
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function json(request: Request, body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  for (const [key, value] of Object.entries(corsHeaders(request))) {
    headers.set(key, value);
  }
  return NextResponse.json(body, { ...init, headers });
}

function deviceTypeFromUserAgent(ua: string): DeviceType {
  if (/ipad|tablet|playbook|silk/i.test(ua)) return "tablet";
  if (/mobi|android|iphone|ipod/i.test(ua)) return "mobile";
  return "desktop";
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
}

const ALLOWED_EVENTS = [
  "page_open",
  "click_discount",
  "click_gift_cta",
  "click_uds",
  "click_telegram",
  "click_max",
  "click_vk",
  "click_call",
  "click_catalog",
  "click_catalog_telegram",
  "click_catalog_max",
  "click_catalog_vk",
  "click_catalog_uds",
  "click_catalog_uds_app",
  "click_catalog_website",
  "select_gift_category_her",
  "select_gift_category_home",
  "select_gift_category_auto",
  "click_gift_category_cta",
  "click_route",
  "click_yandex_maps",
  "click_yandex_navigator",
  "click_2gis",
  "click_google_maps",
  "click_schedule",
] as const;

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRate(ip)) {
    return json(request, { error: "Rate limit" }, { status: 429 });
  }

  const ua = request.headers.get("user-agent") ?? "";
  if (BOT_RE.test(ua)) {
    return json(request, { ok: true, skipped: true });
  }

  const body = await request.json();
  const eventType = String(body.eventType ?? "");
  let partnerId: number | null = null;
  if (body.partnerId != null && body.partnerId !== "") {
    const id = Number(body.partnerId);
    if (Number.isInteger(id) && id > 0) partnerId = id;
  }
  const sessionId = body.sessionId ? String(body.sessionId) : null;
  const site: AnalyticsSite = body.site === "main" ? "main" : "landing";
  const referrer = body.referrer ? String(body.referrer).slice(0, 300) : null;

  if (!ALLOWED_EVENTS.includes(eventType as (typeof ALLOWED_EVENTS)[number])) {
    return json(request, { error: "Invalid event" }, { status: 400 });
  }

  const ipHash = hashIp(ip);

  if (useAnalyticsBlob()) {
    try {
      const result = await appendAnalyticsEvent({
        eventType,
        partnerId,
        sessionId,
        ipHash,
        site,
        referrer,
        deviceType: deviceTypeFromUserAgent(ua),
      });
      return json(request, result);
    } catch (e) {
      console.error("[events] analytics blob", e);
      return json(request, { error: "Analytics save failed" }, { status: 500 });
    }
  }

  await ensureDbReady();

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
    if (existing) return json(request, { ok: true, deduped: true });
  }

  if (eventType === "click_discount" && sessionId) {
    const existing = await prisma.visitEvent.findFirst({
      where: { eventType: "click_discount", sessionId, partnerId },
    });
    if (existing) return json(request, { ok: true, deduped: true });
  }

  await prisma.visitEvent.create({
    data: {
      eventType,
      partnerId,
      sessionId,
      userAgent: ua.slice(0, 500),
      ipHash,
    },
  });

  if (process.env.VERCEL === "1") {
    void persistDbToBlob().catch((e) => {
      console.error("[events] persistDbToBlob", e);
    });
  }

  return json(request, { ok: true });
}
