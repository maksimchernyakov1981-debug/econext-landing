import type { MediaAsset, Partner } from "@prisma/client";
import { ensureDbReady } from "./ensure-db";
import { prisma } from "./prisma";
import { getTodayDateString } from "./timezone";
import { getDayOfWeek, getTodayWorkStatusFromData } from "./schedule/getTodayWorkStatus";
import { formatFullSchedule } from "./schedule/formatSchedule";
import {
  loadSettingsSnapshot,
  useVercelSettingsBackup,
  type SettingsSnapshot,
} from "./settings-backup";

async function getSettingsSource(): Promise<{
  landing: SettingsSnapshot["landing"];
  buttons: SettingsSnapshot["buttons"];
  map: SettingsSnapshot["map"];
  catalog: SettingsSnapshot["catalog"];
  qr: SettingsSnapshot["qr"];
  contacts: SettingsSnapshot["contacts"];
  scheduleDays: SettingsSnapshot["scheduleDays"];
  specialDays: SettingsSnapshot["specialDays"];
  mediaAssets: SettingsSnapshot["mediaAssets"];
}> {
  await ensureDbReady();

  if (useVercelSettingsBackup()) {
    const snap = await loadSettingsSnapshot();
    if (snap) {
      return {
        landing: snap.landing,
        buttons: snap.buttons,
        map: snap.map,
        catalog: snap.catalog,
        qr: snap.qr,
        contacts: snap.contacts,
        scheduleDays: snap.scheduleDays,
        specialDays: snap.specialDays,
        mediaAssets: snap.mediaAssets,
      };
    }
  }

  const [landing, buttons, map, catalog, qr, contacts, scheduleDays, specialDays, mediaAssets] =
    await Promise.all([
      prisma.landingSettings.findFirst({ where: { id: 1 } }),
      prisma.buttonSettings.findFirst({ where: { id: 1 } }),
      prisma.mapSettings.findFirst({ where: { id: 1 } }),
      prisma.catalogSettings.findFirst({ where: { id: 1 } }),
      prisma.qrCardSettings.findFirst({ where: { id: 1 } }),
      prisma.contactSettings.findFirst({ where: { id: 1 } }),
      prisma.workScheduleDay.findMany({ orderBy: { dayOfWeek: "asc" } }),
      prisma.specialDay.findMany({ orderBy: { date: "desc" } }),
      prisma.mediaAsset.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

  if (!landing || !buttons || !map || !catalog || !qr || !contacts) {
    throw new Error("Run prisma db seed — missing singleton settings");
  }

  return { landing, buttons, map, catalog, qr, contacts, scheduleDays, specialDays, mediaAssets };
}

export const STORE_MEDIA_TYPES = ["store_photo", "store_video", "landmark_photo"] as const;

export function filterStoreMedia(assets: MediaAsset[]): MediaAsset[] {
  return assets.filter(
    (m) => m.isActive && (STORE_MEDIA_TYPES as readonly string[]).includes(m.type)
  );
}

export async function getSingletonSettings() {
  const s = await getSettingsSource();
  let scheduleDays = s.scheduleDays;
  if (!scheduleDays?.length) {
    const { ensureScheduleDaysExist } = await import("./ensure-schedule");
    await ensureScheduleDaysExist();
    scheduleDays = await prisma.workScheduleDay.findMany({
      orderBy: { dayOfWeek: "asc" },
    });
  }
  return {
    landing: s.landing,
    buttons: s.buttons,
    map: s.map,
    catalog: s.catalog,
    qr: s.qr,
    contacts: s.contacts,
    scheduleDays,
  };
}

export async function getPartnerBySlug(slug: string) {
  await ensureDbReady();

  if (useVercelSettingsBackup()) {
    const snap = await loadSettingsSnapshot();
    if (snap) {
      return snap.partners.find((p) => p.slug === slug) ?? null;
    }
  }

  return prisma.partner.findUnique({ where: { slug } });
}

export async function getLandingContext(partner: Partner | null) {
  const settings = await getSingletonSettings();
  const full = await getSettingsSource();
  const today = getTodayDateString();

  const specialDay =
    full.specialDays.find((d) => d.date === today && d.isActive) ?? null;

  const dayOfWeek = getDayOfWeek();

  const workStatus = getTodayWorkStatusFromData({
    landing: settings.landing,
    map: settings.map,
    scheduleDays: settings.scheduleDays,
    specialDay,
    dayOfWeek,
    partnerName: partner?.name,
  });

  const fullScheduleText = formatFullSchedule(settings.scheduleDays);
  const storeMedia = filterStoreMedia(full.mediaAssets ?? []);

  return {
    ...settings,
    partner,
    workStatus,
    fullScheduleText,
    specialDay,
    storeMedia,
  };
}
