import type { MediaAsset } from "@prisma/client";
import { prisma } from "./prisma";
import { storeUploadedFile } from "./upload-storage";
import { extForMime, resolveUploadMime, UPLOAD_MIME_ALLOW } from "./upload-mime";
import { captureSettingsSnapshot, persistAndVerifySnapshot } from "./settings-backup";
import { revalidateAllLanding } from "./revalidate-landing";

export async function createMediaFromBuffer(params: {
  buffer: Buffer;
  mime: string;
  type: string;
  title?: string | null;
  sortOrder?: number;
}): Promise<MediaAsset> {
  const { buffer, mime, type } = params;
  if (!UPLOAD_MIME_ALLOW.has(mime)) {
    throw new Error(`Неподдерживаемый формат: ${mime}`);
  }

  const ext = extForMime(mime);
  const name = `${crypto.randomUUID()}.${ext}`;
  const url = await storeUploadedFile(type, name, buffer, mime);

  const maxOrder = await prisma.mediaAsset.aggregate({ _max: { sortOrder: true } });
  const sortOrder = params.sortOrder ?? (maxOrder._max.sortOrder ?? 0) + 1;

  const asset = await prisma.mediaAsset.create({
    data: {
      type,
      title: params.title?.trim() || null,
      url,
      altText: null,
      sortOrder,
      isActive: true,
    },
  });

  return asset;
}

export async function persistMediaAfterUpload(): Promise<{ ok: boolean; error?: string }> {
  await revalidateAllLanding();
  if (process.env.VERCEL === "1") {
    const snap = await captureSettingsSnapshot();
    const verified = await persistAndVerifySnapshot(snap);
    if (!verified.ok) {
      return { ok: false, error: verified.message ?? "Не сохранено в Blob" };
    }
  }
  return { ok: true };
}

export function parseUploadFile(file: File): { mime: string; buffer: Promise<Buffer> } {
  const mime = resolveUploadMime(file);
  if (!mime || !UPLOAD_MIME_ALLOW.has(mime)) {
    throw new Error(`Формат не поддерживается: ${file.name}`);
  }
  return {
    mime,
    buffer: file.arrayBuffer().then((ab) => Buffer.from(ab)),
  };
}
