import { access, copyFile, mkdir } from "fs/promises";
import path from "path";
import { applyDatabaseUrl, resolveDatabaseUrl } from "./database-url";
import { isBlobStorageConfigured, loadDbFromBlob } from "./db-persist";
import { loadSettingsSnapshot } from "./settings-backup";

let localInitPromise: Promise<void> | null = null;

export function ensureDbReady(): Promise<void> {
  if (process.env.VERCEL === "1") {
    return initDbOnVercel();
  }
  if (!localInitPromise) {
    localInitPromise = initDbLocal();
  }
  return localInitPromise;
}

async function initDbLocal(): Promise<void> {
  applyDatabaseUrl();
}

async function initDbOnVercel(): Promise<void> {
  applyDatabaseUrl();

  const target = resolveDatabaseUrl().replace("file:", "");
  const bundled = path.join(process.cwd(), "prisma", "prod.db");

  // JSON-настройки из Blob (главный источник на Vercel)
  await loadSettingsSnapshot();

  if (isBlobStorageConfigured()) {
    await loadDbFromBlob();
  }

  try {
    await access(target);
    return;
  } catch {
    // файла нет — копируем из сборки
  }

  try {
    await access(bundled);
  } catch (e) {
    console.error("[ensure-db] prisma/prod.db not found in deployment", e);
    throw new Error("Database file missing. Redeploy with latest build.");
  }

  await mkdir(path.dirname(target), { recursive: true });
  await copyFile(bundled, target);
}
