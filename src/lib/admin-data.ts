import { ensureDbReady } from "./ensure-db";
import { getSingletonSettings, getPartnerBySlug } from "./landing-data";
import { prisma } from "./prisma";
import {
  clearSettingsSnapshotCache,
  loadSettingsSnapshot,
  useVercelSettingsBackup,
} from "./settings-backup";

/** Все формы админки читают те же данные, что и лендинг (в т.ч. JSON из Blob на Vercel). */
export async function getAdminSettings() {
  if (useVercelSettingsBackup()) clearSettingsSnapshotCache();
  return getSingletonSettings();
}

export async function getAdminPartners() {
  await ensureDbReady();
  if (useVercelSettingsBackup()) {
    clearSettingsSnapshotCache();
    const snap = await loadSettingsSnapshot();
    if (snap) return snap.partners;
  }
  return prisma.partner.findMany({ orderBy: { name: "asc" } });
}

export async function getAdminPartner(id: number) {
  const partners = await getAdminPartners();
  return partners.find((p) => p.id === id) ?? null;
}

export async function getAdminPartnerBySlug(slug: string) {
  return getPartnerBySlug(slug);
}

export async function getAdminSpecialDays() {
  await ensureDbReady();
  if (useVercelSettingsBackup()) {
    clearSettingsSnapshotCache();
    const snap = await loadSettingsSnapshot();
    if (snap) return snap.specialDays;
  }
  return prisma.specialDay.findMany({ orderBy: { date: "desc" } });
}

export async function getAdminMedia() {
  await ensureDbReady();
  if (useVercelSettingsBackup()) {
    clearSettingsSnapshotCache();
    const snap = await loadSettingsSnapshot();
    if (snap) return snap.mediaAssets;
  }
  return prisma.mediaAsset.findMany({ orderBy: { sortOrder: "asc" } });
}

export { getSingletonSettings };
