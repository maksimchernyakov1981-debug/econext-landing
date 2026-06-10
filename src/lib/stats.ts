import { ensureDbReady } from "./ensure-db";
import { prisma } from "./prisma";

export type StatsPeriod = "today" | "7d" | "30d" | "all";

function periodStart(period: StatsPeriod): Date | null {
  if (period === "all") return null;
  const d = new Date();
  if (period === "today") {
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (period === "7d") {
    d.setDate(d.getDate() - 7);
    return d;
  }
  d.setDate(d.getDate() - 30);
  return d;
}

const EVENT_TYPES = [
  "page_open",
  "click_gift_cta",
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
  "click_discount",
] as const;

export async function getStatsSummary(period: StatsPeriod = "today") {
  await ensureDbReady();
  const since = periodStart(period);
  const where = since ? { createdAt: { gte: since } } : {};

  const counts = await Promise.all(
    EVENT_TYPES.map(async (eventType) => ({
      eventType,
      count: await prisma.visitEvent.count({
        where: { ...where, eventType },
      }),
    }))
  );

  const map = Object.fromEntries(counts.map((c) => [c.eventType, c.count]));

  return {
    page_open: map.page_open ?? 0,
    click_uds: map.click_uds ?? 0,
    click_telegram: map.click_telegram ?? 0,
    click_max: map.click_max ?? 0,
    click_route: map.click_route ?? 0,
    click_catalog: map.click_catalog ?? 0,
    click_schedule: map.click_schedule ?? 0,
    all: counts,
  };
}

export async function getTopPartners(days = 7, limit = 5) {
  await ensureDbReady();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const events = await prisma.visitEvent.groupBy({
    by: ["partnerId"],
    where: {
      eventType: "page_open",
      createdAt: { gte: since },
      partnerId: { not: null },
    },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });

  const partners = await prisma.partner.findMany({
    where: { id: { in: events.map((e) => e.partnerId!).filter(Boolean) } },
  });

  return events.map((e) => ({
    partner: partners.find((p) => p.id === e.partnerId),
    count: e._count.id,
  }));
}

export async function getPartnerStats(partnerId: number, period: StatsPeriod) {
  await ensureDbReady();
  const since = periodStart(period);
  const where = {
    partnerId,
    ...(since ? { createdAt: { gte: since } } : {}),
  };

  const result: Record<string, number> = {};
  for (const et of EVENT_TYPES) {
    result[et] = await prisma.visitEvent.count({
      where: { ...where, eventType: et },
    });
  }
  return result;
}
