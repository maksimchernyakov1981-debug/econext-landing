import { randomUUID } from "crypto";
import { blobSdkAuthOptions } from "./blob-auth";
import { isBlobStorageConfigured } from "./db-persist";
import { useVercelSettingsBackup } from "./settings-backup";

const ANALYTICS_PATH = "econext-analytics.json";
const ACCESS_MODES = ["private", "public"] as const;
const MAX_EVENTS = 50_000;

export type AnalyticsEvent = {
  id: string;
  eventType: string;
  partnerId: number | null;
  sessionId: string | null;
  createdAt: string;
  ipHash: string | null;
};

type AnalyticsSnapshot = {
  version: 1;
  events: AnalyticsEvent[];
};

let cached: AnalyticsSnapshot | null = null;

function emptySnapshot(): AnalyticsSnapshot {
  return { version: 1, events: [] };
}

function blobJsonOptions(access: (typeof ACCESS_MODES)[number]) {
  return {
    ...blobSdkAuthOptions(access),
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  };
}

function parseSnapshot(text: string): AnalyticsSnapshot | null {
  try {
    const parsed = JSON.parse(text) as AnalyticsSnapshot;
    if (parsed?.version === 1 && Array.isArray(parsed.events)) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function useAnalyticsBlob(): boolean {
  return useVercelSettingsBackup();
}

export async function loadAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  if (cached) return cached;
  if (!isBlobStorageConfigured()) {
    cached = emptySnapshot();
    return cached;
  }

  try {
    const { get } = await import("@vercel/blob");
    for (const access of ACCESS_MODES) {
      try {
        const result = await get(ANALYTICS_PATH, {
          ...blobSdkAuthOptions(access),
          useCache: false,
        });
        if (!result?.stream) continue;
        const text = await new Response(result.stream).text();
        const parsed = parseSnapshot(text);
        if (parsed) {
          cached = parsed;
          return parsed;
        }
      } catch {
        continue;
      }
    }
  } catch (e) {
    console.error("[analytics-blob] load", e);
  }

  cached = emptySnapshot();
  return cached;
}

async function persistAnalyticsSnapshot(snapshot: AnalyticsSnapshot): Promise<void> {
  if (!isBlobStorageConfigured()) {
    cached = snapshot;
    return;
  }

  const json = JSON.stringify(snapshot);
  const { put } = await import("@vercel/blob");
  let saved = false;

  for (const access of ACCESS_MODES) {
    try {
      await put(ANALYTICS_PATH, json, blobJsonOptions(access));
      saved = true;
      break;
    } catch (e) {
      console.error(`[analytics-blob] put ${access}`, e);
    }
  }

  if (!saved) {
    throw new Error("Не удалось сохранить аналитику в Blob");
  }

  cached = snapshot;
}

export async function appendAnalyticsEvent(input: {
  eventType: string;
  partnerId: number | null;
  sessionId: string | null;
  ipHash: string | null;
}): Promise<{ ok: boolean; deduped?: boolean }> {
  const snapshot = await loadAnalyticsSnapshot();
  const events = snapshot.events;

  if (input.eventType === "page_open" && input.sessionId) {
    const since = Date.now() - 30 * 60 * 1000;
    const existing = events.find(
      (e) =>
        e.eventType === "page_open" &&
        e.sessionId === input.sessionId &&
        e.partnerId === input.partnerId &&
        new Date(e.createdAt).getTime() >= since
    );
    if (existing) return { ok: true, deduped: true };
  }

  if (input.eventType === "click_discount" && input.sessionId) {
    const existing = events.find(
      (e) =>
        e.eventType === "click_discount" &&
        e.sessionId === input.sessionId &&
        e.partnerId === input.partnerId
    );
    if (existing) return { ok: true, deduped: true };
  }

  events.push({
    id: randomUUID(),
    eventType: input.eventType,
    partnerId: input.partnerId,
    sessionId: input.sessionId,
    createdAt: new Date().toISOString(),
    ipHash: input.ipHash,
  });

  if (events.length > MAX_EVENTS) {
    snapshot.events = events.slice(-MAX_EVENTS);
  }

  await persistAnalyticsSnapshot(snapshot);
  return { ok: true };
}

export function filterAnalyticsEvents(
  events: AnalyticsEvent[],
  opts: {
    since: Date | null;
    partnerId?: number | null;
  }
): AnalyticsEvent[] {
  return events.filter((e) => {
    if (opts.since && new Date(e.createdAt) < opts.since) return false;
    if (opts.partnerId !== undefined && e.partnerId !== opts.partnerId) return false;
    return true;
  });
}

export function countAnalyticsByType(events: AnalyticsEvent[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const e of events) {
    result[e.eventType] = (result[e.eventType] ?? 0) + 1;
  }
  return result;
}

export function topPartnersFromAnalytics(
  events: AnalyticsEvent[],
  since: Date,
  limit: number
): { partnerId: number; count: number }[] {
  const map = new Map<number, number>();
  for (const e of events) {
    if (e.eventType !== "page_open" || e.partnerId == null) continue;
    if (new Date(e.createdAt) < since) continue;
    map.set(e.partnerId, (map.get(e.partnerId) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([partnerId, count]) => ({ partnerId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
