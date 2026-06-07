import {
  isOfferTextsCurrent,
  mergeOfferTextsIntoSnapshot,
} from "./offer-texts";
import {
  applySnapshotToPrisma,
  loadSettingsSnapshot,
  persistSettingsSnapshot,
  type SettingsSnapshot,
  useVercelSettingsBackup,
} from "./settings-backup";

/** Обновить тексты оффера в снимке, если версия устарела. */
export async function ensureOfferTextsInSnapshot(
  snapshot: SettingsSnapshot
): Promise<SettingsSnapshot> {
  if (isOfferTextsCurrent(snapshot)) return snapshot;
  return mergeOfferTextsIntoSnapshot(snapshot);
}

/** На Vercel: при старте подтянуть актуальные тексты в Blob и SQLite. */
export async function autoSyncOfferTextsOnVercel(): Promise<void> {
  if (!useVercelSettingsBackup()) return;

  const current = await loadSettingsSnapshot();
  if (!current) return;

  const updated = await ensureOfferTextsInSnapshot(current);
  if (updated === current) return;

  const saved = await persistSettingsSnapshot(updated);
  if (!saved.ok) {
    console.error("[offer-texts] auto-sync blob failed", saved.message);
    return;
  }

  try {
    await applySnapshotToPrisma(updated);
    console.info("[offer-texts] auto-synced to version", updated.offerTextsVersion);
  } catch (e) {
    console.error("[offer-texts] auto-sync prisma failed", e);
  }
}
