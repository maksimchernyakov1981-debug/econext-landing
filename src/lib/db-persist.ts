import { readFile, access } from "fs/promises";
import path from "path";
import { resolveDatabaseUrl } from "./database-url";

const BLOB_PATHNAME = "econext-live.db";

function dbFilePath(): string {
  return resolveDatabaseUrl().replace("file:", "");
}

/** Blob подключён: явный токен или OIDC на Vercel (после Connect to Project). */
export function isBlobStorageConfigured(): boolean {
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) return true;
  if (process.env.VERCEL === "1" && process.env.BLOB_STORE_ID?.trim()) return true;
  return false;
}

/** Скачать актуальную БД из Vercel Blob. */
export async function loadDbFromBlob(): Promise<boolean> {
  if (process.env.VERCEL !== "1" || !isBlobStorageConfigured()) return false;

  try {
    const { head } = await import("@vercel/blob");
    const meta = await head(BLOB_PATHNAME);
    const res = await fetch(meta.url);
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    const target = dbFilePath();
    const { writeFile, mkdir } = await import("fs/promises");
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, buf);
    return true;
  } catch {
    return false;
  }
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

  try {
    const target = dbFilePath();
    await access(target);
    const data = await readFile(target);
    const { put } = await import("@vercel/blob");
    await put(BLOB_PATHNAME, data, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return { ok: true };
  } catch (e) {
    console.error("[db-persist]", e);
    return { ok: false, message: "Не удалось сохранить базу в Blob" };
  }
}
