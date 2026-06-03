import { readFile, access, writeFile, mkdir } from "fs/promises";
import path from "path";
import { resolveDatabaseUrl } from "./database-url";

const BLOB_PATHNAME = "econext-live.db";
const ACCESS_MODES = ["private", "public"] as const;

function dbFilePath(): string {
  return resolveDatabaseUrl().replace("file:", "");
}

/** Blob подключён: явный токен или OIDC на Vercel (после Connect to Project). */
export function isBlobStorageConfigured(): boolean {
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) return true;
  if (process.env.VERCEL === "1" && process.env.BLOB_STORE_ID?.trim()) return true;
  return false;
}

async function flushSqliteForBackup(): Promise<void> {
  const { prisma } = await import("./prisma");
  try {
    await prisma.$executeRawUnsafe("PRAGMA wal_checkpoint(TRUNCATE)");
  } catch {
    /* ignore */
  }
  await prisma.$disconnect();
}

function blobPutOptions(access: (typeof ACCESS_MODES)[number]) {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  return {
    access,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/x-sqlite3",
    ...(token ? { token } : {}),
  };
}

/** Скачать актуальную БД из Vercel Blob. */
export async function loadDbFromBlob(): Promise<boolean> {
  if (process.env.VERCEL !== "1" || !isBlobStorageConfigured()) return false;

  const target = dbFilePath();

  try {
    const { get } = await import("@vercel/blob");
    for (const access of ACCESS_MODES) {
      try {
        const result = await get(BLOB_PATHNAME, {
          access,
          useCache: false,
        });
        if (!result?.stream) continue;
        const buf = Buffer.from(await new Response(result.stream).arrayBuffer());
        await mkdir(path.dirname(target), { recursive: true });
        await writeFile(target, buf);
        return true;
      } catch {
        continue;
      }
    }
  } catch (e) {
    console.error("[db-persist] load", e);
  }
  return false;
}

/** Загрузить текущую БД в Blob после изменений в админке. */
export async function persistDbToBlob(): Promise<{ ok: boolean; message?: string }> {
  if (process.env.VERCEL !== "1" || !isBlobStorageConfigured()) {
    return {
      ok: false,
      message:
        "Подключите Blob к проекту (Storage → Connect) и сделайте Redeploy",
    };
  }

  const errors: string[] = [];

  try {
    const target = dbFilePath();
    await access(target);
    await flushSqliteForBackup();
    const data = await readFile(target);
    const { put } = await import("@vercel/blob");

    for (const access of ACCESS_MODES) {
      try {
        await put(BLOB_PATHNAME, data, blobPutOptions(access));
        console.info(`[db-persist] saved as ${access}`);
        try {
          const { prisma } = await import("./prisma");
          await prisma.$disconnect();
        } catch {
          /* ignore */
        }
        return { ok: true };
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        errors.push(`${access}: ${msg}`);
        console.error(`[db-persist] put ${access}`, e);
      }
    }

    return {
      ok: false,
      message:
        errors.join(" · ") ||
        "Не удалось сохранить базу. Проверьте Blob Store (private/public) в Vercel.",
    };
  } catch (e) {
    console.error("[db-persist]", e);
    const msg = e instanceof Error ? e.message : "Ошибка чтения файла БД";
    return { ok: false, message: msg };
  }
}
