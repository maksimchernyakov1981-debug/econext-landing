import {
  countAnalyticsByType,
  filterAnalyticsEvents,
  loadAnalyticsSnapshot,
  topPartnersFromAnalytics,
  useAnalyticsBlob,
} from "./analytics-blob";
import { ensureDbReady } from "./ensure-db";
import { prisma } from "./prisma";
import { loadSettingsSnapshot } from "./settings-backup";

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

export const EVENT_TYPES = [
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

function emptyCounts(): Record<string, number> {
  return Object.fromEntries(EVENT_TYPES.map((et) => [et, 0]));
}

async function countEvents(opts: {
  since: Date | null;
  partnerId?: number | null;
}): Promise<Record<string, number>> {
  if (useAnalyticsBlob()) {
    const snap = await loadAnalyticsSnapshot();
    const filtered = filterAnalyticsEvents(snap.events, opts);
    return { ...emptyCounts(), ...countAnalyticsByType(filtered) };
  }

  await ensureDbReady();
  const where = {
    ...(opts.partnerId !== undefined ? { partnerId: opts.partnerId } : {}),
    ...(opts.since ? { createdAt: { gte: opts.since } } : {}),
  };

  const result = emptyCounts();
  const counts = await Promise.all(
    EVENT_TYPES.map(async (eventType) => ({
      eventType,
      count: await prisma.visitEvent.count({ where: { ...where, eventType } }),
    }))
  );
  for (const { eventType, count } of counts) {
    result[eventType] = count;
  }
  return result;
}

export async function queryEventCounts(opts: {
  period: StatsPeriod;
  partnerId?: number | null;
}): Promise<{ eventType: string; count: number }[]> {
  const since = periodStart(opts.period);
  const counts = await countEvents({ since, partnerId: opts.partnerId });
  return Object.entries(counts)
    .filter(([, count]) => count > 0)
    .map(([eventType, count]) => ({ eventType, count }));
}

export async function getStatsSummary(period: StatsPeriod = "today") {
  const since = periodStart(period);
  const counts = await countEvents({ since });

  return {
    page_open: counts.page_open ?? 0,
    click_uds: counts.click_uds ?? 0,
    click_telegram: counts.click_telegram ?? 0,
    click_max: counts.click_max ?? 0,
    click_route: counts.click_route ?? 0,
    click_catalog: counts.click_catalog ?? 0,
    click_schedule: counts.click_schedule ?? 0,
    all: EVENT_TYPES.map((eventType) => ({
      eventType,
      count: counts[eventType] ?? 0,
    })),
  };
}

export async function getTopPartners(days = 7, limit = 5) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  if (useAnalyticsBlob()) {
    const analytics = await loadAnalyticsSnapshot();
    const top = topPartnersFromAnalytics(analytics.events, since, limit);
    const settings = await loadSettingsSnapshot();
    const partners = settings?.partners ?? [];
    return top.map((row) => ({
      partner: partners.find((p) => p.id === row.partnerId),
      count: row.count,
    }));
  }

  await ensureDbReady();
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
  const since = periodStart(period);
  return countEvents({ since, partnerId });
}
