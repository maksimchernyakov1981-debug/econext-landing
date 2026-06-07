import type {
  ButtonSettings,
  CatalogSettings,
  ContactSettings,
  LandingSettings,
  MapSettings,
  MediaAsset,
  Partner,
  QrCardSettings,
  SpecialDay,
  WorkScheduleDay,
} from "@prisma/client";
import { isBlobStorageConfigured } from "./db-persist";
import { ensureDbReady } from "./ensure-db";
import {
  ensureSqliteSchemaMigrations,
  filterMapSettingsForSqlite,
} from "./ensure-schema";
import { prisma } from "./prisma";

const BACKUP_PATH = "econext-settings.json";
const ACCESS_MODES = ["private", "public"] as const;

export type SettingsSnapshot = {
  version: 1;
  savedAt: string;
  contacts: ContactSettings;
  map: MapSettings;
  landing: LandingSettings;
  buttons: ButtonSettings;
  catalog: CatalogSettings;
  qr: QrCardSettings;
  scheduleDays: WorkScheduleDay[];
  partners: Partner[];
  specialDays: SpecialDay[];
  mediaAssets: MediaAsset[];
};

/** Старые снимки Blob могут не содержать новые поля — нормализуем перед использованием. */
export function normalizeSnapshot(snap: SettingsSnapshot): SettingsSnapshot {
  return {
    ...snap,
    scheduleDays: snap.scheduleDays ?? [],
    partners: snap.partners ?? [],
    specialDays: snap.specialDays ?? [],
    mediaAssets: snap.mediaAssets ?? [],
    landing: {
      ...snap.landing,
      storeMediaBlockTitle:
        snap.landing.storeMediaBlockTitle ?? "📸 Фото и видео точки",
    },
  };
}

let cachedSnapshot: SettingsSnapshot | null = null;

function blobJsonOptions(access: (typeof ACCESS_MODES)[number]) {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  return {
    access,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    ...(token ? { token } : {}),
  };
}

/** Снять снимок всех настроек из SQLite (после записи в админке). */
export async function captureSettingsSnapshot(): Promise<SettingsSnapshot> {
  await ensureDbReady();
  await ensureSqliteSchemaMigrations();
  const [contacts, map, landing, buttons, catalog, qr, scheduleDays, partners, specialDays, mediaAssets] =
    await Promise.all([
      prisma.contactSettings.findFirstOrThrow({ where: { id: 1 } }),
      prisma.mapSettings.findFirstOrThrow({ where: { id: 1 } }),
      prisma.landingSettings.findFirstOrThrow({ where: { id: 1 } }),
      prisma.buttonSettings.findFirstOrThrow({ where: { id: 1 } }),
      prisma.catalogSettings.findFirstOrThrow({ where: { id: 1 } }),
      prisma.qrCardSettings.findFirstOrThrow({ where: { id: 1 } }),
      prisma.workScheduleDay.findMany({ orderBy: { dayOfWeek: "asc" } }),
      prisma.partner.findMany({ orderBy: { name: "asc" } }),
      prisma.specialDay.findMany({ orderBy: { date: "desc" } }),
      prisma.mediaAsset.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

  return normalizeSnapshot({
    version: 1,
    savedAt: new Date().toISOString(),
    contacts,
    map,
    landing,
    buttons,
    catalog,
    qr,
    scheduleDays,
    partners,
    specialDays,
    mediaAssets,
  });
}

/** Сохранить JSON в Blob — основной способ хранения настроек на Vercel. */
export async function persistSettingsSnapshot(
  snapshot?: SettingsSnapshot
): Promise<{ ok: boolean; message?: string }> {
  if (!isBlobStorageConfigured()) {
    return { ok: false, message: "Blob Storage не подключён" };
  }

  let data = snapshot ?? (await captureSettingsSnapshot());
  data = { ...data, map: normalizeMapRow(data.map) };
  const json = JSON.stringify(data);
  const errors: string[] = [];

  try {
    const { put } = await import("@vercel/blob");
    for (const access of ACCESS_MODES) {
      try {
        await put(BACKUP_PATH, json, blobJsonOptions(access));
        cachedSnapshot = data;
        console.info("[settings-backup] saved", data.savedAt);
        return { ok: true };
      } catch (e) {
        errors.push(e instanceof Error ? e.message : String(e));
      }
    }
    return { ok: false, message: errors.join(" · ") || "Ошибка записи JSON в Blob" };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Ошибка Blob",
    };
  }
}

function parseSnapshotJson(text: string): SettingsSnapshot | null {
  try {
    const parsed = JSON.parse(text) as SettingsSnapshot;
    if (parsed?.version === 1 && parsed.contacts) return normalizeSnapshot(parsed);
  } catch {
    /* ignore */
  }
  return null;
}

async function loadSettingsSnapshotViaList(): Promise<SettingsSnapshot | null> {
  try {
    const { list } = await import("@vercel/blob");
    const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
    for (const access of ACCESS_MODES) {
      try {
        const { blobs } = await list({
          prefix: "econext-settings",
          ...(token ? { token } : {}),
        });
        const hit = blobs.find(
          (b) => b.pathname === BACKUP_PATH || b.pathname.endsWith(BACKUP_PATH)
        );
        if (!hit?.url) continue;
        const text = await fetch(hit.url).then((r) => r.text());
        const parsed = parseSnapshotJson(text);
        if (parsed) {
          cachedSnapshot = parsed;
          return parsed;
        }
      } catch {
        continue;
      }
    }
  } catch (e) {
    console.error("[settings-backup] list", e);
  }
  return null;
}

/** Загрузить настройки из Blob (приоритет на Vercel). */
export async function loadSettingsSnapshot(): Promise<SettingsSnapshot | null> {
  if (cachedSnapshot) return cachedSnapshot;
  if (!isBlobStorageConfigured()) return null;

  try {
    const { get } = await import("@vercel/blob");
    const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
    for (const access of ACCESS_MODES) {
      try {
        const result = await get(BACKUP_PATH, {
          access,
          useCache: false,
          ...(token ? { token } : {}),
        });
        if (!result?.stream) continue;
        const text = await new Response(result.stream).text();
        const parsed = parseSnapshotJson(text);
        if (parsed) {
          cachedSnapshot = parsed;
          return parsed;
        }
      } catch {
        continue;
      }
    }
  } catch (e) {
    console.error("[settings-backup] load", e);
  }

  return loadSettingsSnapshotViaList();
}

/** Записать снимок в Blob и убедиться, что файл читается обратно. */
export async function persistAndVerifySnapshot(
  snapshot: SettingsSnapshot
): Promise<{ ok: boolean; message?: string; snapshot?: SettingsSnapshot }> {
  snapshot.savedAt = new Date().toISOString();
  const save = await persistSettingsSnapshot(snapshot);
  if (!save.ok) return save;

  clearSettingsSnapshotCache();
  const verify = await loadSettingsSnapshot();
  if (!verify) {
    return {
      ok: false,
      message:
        "Запись в Blob не подтверждена. Vercel → Storage → Blob → файл econext-settings.json",
    };
  }

  await hydratePrismaFromSnapshot(verify);
  return { ok: true, snapshot: verify };
}

export function clearSettingsSnapshotCache() {
  cachedSnapshot = null;
}

export function useVercelSettingsBackup(): boolean {
  return process.env.VERCEL === "1" && isBlobStorageConfigured();
}

/** Ссылки для блока «Скидка» (глобальные контакты). */
export function countDiscountContactLinks(contacts: SettingsSnapshot["contacts"]): number {
  return [contacts.udsUrl, contacts.telegramBotUrl, contacts.maxBotUrl].filter((u) =>
    u?.trim()
  ).length;
}

function withoutId<T extends { id: number }>(row: T) {
  const { id: _id, ...rest } = row;
  return rest;
}

export function normalizeMapRow(map: SettingsSnapshot["map"]): SettingsSnapshot["map"] {
  return {
    ...map,
    mapDisplayMode: map.mapDisplayMode ?? "auto",
  };
}

/** Перед записью в SQLite на Vercel подтягиваем последний снимок из Blob. */
export async function hydratePrismaFromSnapshot(
  snapshot: SettingsSnapshot
): Promise<void> {
  await ensureDbReady();
  await ensureSqliteSchemaMigrations();
  const snap = normalizeSnapshot(snapshot);
  const { contacts, map: rawMap, landing, buttons, catalog, qr, scheduleDays, partners, specialDays, mediaAssets } =
    snap;
  const map = normalizeMapRow(rawMap);
  const mapPayload = await filterMapSettingsForSqlite(withoutId(map));

  await prisma.$transaction([
    prisma.contactSettings.update({ where: { id: 1 }, data: withoutId(contacts) }),
    prisma.mapSettings.update({ where: { id: 1 }, data: mapPayload }),
    prisma.landingSettings.update({ where: { id: 1 }, data: withoutId(landing) }),
    prisma.buttonSettings.update({ where: { id: 1 }, data: withoutId(buttons) }),
    prisma.catalogSettings.update({ where: { id: 1 }, data: withoutId(catalog) }),
    prisma.qrCardSettings.update({ where: { id: 1 }, data: withoutId(qr) }),
  ]);

  for (const d of scheduleDays) {
    await prisma.workScheduleDay.upsert({
      where: { dayOfWeek: d.dayOfWeek },
      create: {
        dayOfWeek: d.dayOfWeek,
        isWorking: d.isWorking,
        openTime1: d.openTime1,
        closeTime1: d.closeTime1,
        openTime2: d.openTime2,
        closeTime2: d.closeTime2,
        note: d.note,
      },
      update: {
        isWorking: d.isWorking,
        openTime1: d.openTime1,
        closeTime1: d.closeTime1,
        openTime2: d.openTime2,
        closeTime2: d.closeTime2,
        note: d.note,
      },
    });
  }

  const existingPartners = await prisma.partner.findMany({ select: { id: true } });
  const keepPartnerIds = new Set(partners.map((p) => p.id));
  for (const p of existingPartners) {
    if (!keepPartnerIds.has(p.id)) {
      await prisma.partner.delete({ where: { id: p.id } });
    }
  }
  for (const p of partners) {
    await prisma.partner.upsert({
      where: { id: p.id },
      create: p,
      update: withoutId(p),
    });
  }

  const existingDays = await prisma.specialDay.findMany({ select: { id: true } });
  const keepDayIds = new Set(specialDays.map((d) => d.id));
  for (const d of existingDays) {
    if (!keepDayIds.has(d.id)) {
      await prisma.specialDay.delete({ where: { id: d.id } });
    }
  }
  for (const d of specialDays) {
    await prisma.specialDay.upsert({
      where: { id: d.id },
      create: d,
      update: withoutId(d),
    });
  }

  const existingMedia = await prisma.mediaAsset.findMany({ select: { id: true } });
  const keepMediaIds = new Set(mediaAssets.map((m) => m.id));
  for (const m of existingMedia) {
    if (!keepMediaIds.has(m.id)) {
      await prisma.mediaAsset.delete({ where: { id: m.id } });
    }
  }
  for (const m of mediaAssets) {
    await prisma.mediaAsset.upsert({
      where: { id: m.id },
      create: m,
      update: withoutId(m),
    });
  }
}

/** На Vercel SQLite в /tmp — перед сохранением восстанавливаем данные из JSON Blob. */
export async function ensurePrismaSyncedFromBlob(): Promise<void> {
  if (!useVercelSettingsBackup()) return;
  clearSettingsSnapshotCache();
  const snap = await loadSettingsSnapshot();
  if (!snap) return;
  try {
    await hydratePrismaFromSnapshot(snap);
  } catch (e) {
    console.error("[settings-backup] hydrate skipped", e);
  }
}
