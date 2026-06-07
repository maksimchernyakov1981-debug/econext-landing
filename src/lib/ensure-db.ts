import { access, copyFile, mkdir } from "fs/promises";
import path from "path";
import { applyDatabaseUrl, resolveDatabaseUrl } from "./database-url";
import { isBlobStorageConfigured, loadDbFromBlob } from "./db-persist";
import { autoSyncOfferTextsOnVercel } from "./sync-offer-texts";
import { applySnapshotToPrisma, loadSettingsSnapshot } from "./settings-backup";
import { ensureSqliteSchemaMigrations } from "./ensure-schema";

let localInitPromise: Promise<void> | null = null;
let vercelInitPromise: Promise<void> | null = null;

export function ensureDbReady(): Promise<void> {
  if (process.env.VERCEL === "1") {
    if (!vercelInitPromise) {
      vercelInitPromise = initDbOnVercel();
    }
    return vercelInitPromise;
  }
  if (!localInitPromise) {
    localInitPromise = initDbLocal();
  }
  return localInitPromise;
}

async function initDbLocal(): Promise<void> {
  applyDatabaseUrl();
  await ensureSqliteSchemaMigrations();
}

async function initDbOnVercel(): Promise<void> {
  applyDatabaseUrl();

  const target = resolveDatabaseUrl().replace("file:", "");
  const bundled = path.join(process.cwd(), "prisma", "prod.db");

  const snap = await loadSettingsSnapshot();
  if (!snap && isBlobStorageConfigured()) {
    await loadDbFromBlob();
  }

  let dbExists = false;
  try {
    await access(target);
    dbExists = true;
  } catch {
    /* создаём из prod.db */
  }

  if (!dbExists) {
    try {
      await access(bundled);
    } catch (e) {
      console.error("[ensure-db] prisma/prod.db not found in deployment", e);
      throw new Error("Database file missing. Redeploy with latest build.");
    }
    await mkdir(path.dirname(target), { recursive: true });
    await copyFile(bundled, target);
  }

  await ensureSqliteSchemaMigrations();

  if (snap) {
    try {
      await applySnapshotToPrisma(snap);
    } catch (e) {
      console.error("[ensure-db] hydrate from snapshot", e);
    }
  }

  try {
    await autoSyncOfferTextsOnVercel();
  } catch (e) {
    console.error("[ensure-db] offer texts auto-sync", e);
  }
}
