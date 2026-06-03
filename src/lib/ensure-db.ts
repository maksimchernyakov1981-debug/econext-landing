import { access, copyFile, mkdir } from "fs/promises";
import path from "path";
import { applyDatabaseUrl, resolveDatabaseUrl } from "./database-url";

let initPromise: Promise<void> | null = null;

export function ensureDbReady(): Promise<void> {
  if (!initPromise) {
    initPromise = initDb();
  }
  return initPromise;
}

async function initDb(): Promise<void> {
  applyDatabaseUrl();

  if (process.env.VERCEL !== "1") {
    return;
  }

  const target = resolveDatabaseUrl().replace("file:", "");
  const bundled = path.join(process.cwd(), "prisma", "prod.db");

  try {
    await access(target);
    return;
  } catch {
    // copy bundled DB to /tmp
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
