import { writeFile, mkdir, readFile, access } from "fs/promises";
import path from "path";
import { isBlobStorageConfigured } from "./db-persist";
import { getPublicUploadUrl, getUploadRoot } from "./uploads";

const BLOB_ACCESS = ["public", "private"] as const;

function blobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim();
}

/** Сохранить файл: на Vercel — в Blob (постоянный URL), локально — в public/uploads. */
export async function storeUploadedFile(
  type: string,
  filename: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  if (process.env.VERCEL === "1" && isBlobStorageConfigured()) {
    const { put } = await import("@vercel/blob");
    const pathname = `uploads/${type}/${filename}`;
    const token = blobToken();
    const errors: string[] = [];

    for (const access of BLOB_ACCESS) {
      try {
        const blob = await put(pathname, buffer, {
          access,
          contentType,
          addRandomSuffix: false,
          allowOverwrite: true,
          ...(token ? { token } : {}),
        });
        return blob.url;
      } catch (e) {
        errors.push(e instanceof Error ? e.message : String(e));
      }
    }
    throw new Error(errors.join(" · ") || "Blob upload failed");
  }

  const dir = path.join(getUploadRoot(), type);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return getPublicUploadUrl(type, filename);
}

/** Прочитать загруженный файл (локально или из Blob на Vercel). */
export async function readUploadedFile(
  type: string,
  filename: string
): Promise<{ buffer: Buffer; contentType: string } | null> {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
  const contentType =
    ext === "png"
      ? "image/png"
      : ext === "webp"
        ? "image/webp"
        : "image/jpeg";

  const localPath = path.join(getUploadRoot(), type, filename);
  try {
    await access(localPath);
    const buffer = await readFile(localPath);
    return { buffer, contentType };
  } catch {
    /* try blob */
  }

  if (!isBlobStorageConfigured()) return null;

  try {
    const { get } = await import("@vercel/blob");
    const pathname = `uploads/${type}/${filename}`;
    const token = blobToken();
    for (const access of BLOB_ACCESS) {
      try {
        const result = await get(pathname, {
          access,
          useCache: false,
          ...(token ? { token } : {}),
        });
        if (!result?.stream) continue;
        const buffer = Buffer.from(await new Response(result.stream).arrayBuffer());
        return { buffer, contentType };
      } catch {
        continue;
      }
    }
  } catch (e) {
    console.error("[upload-storage] read", e);
  }
  return null;
}
