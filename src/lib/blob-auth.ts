import { env } from "./env";

/** Read-write token для client uploads (handleUpload / generateClientToken). OIDC не подходит. */
export function getBlobReadWriteToken(): string | null {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  return token || null;
}

export function canUseBlobClientUpload(): boolean {
  return Boolean(getBlobReadWriteToken());
}

export function blobClientUploadSetupHint(): string {
  return (
    "Для видео и файлов >4 МБ нужен BLOB_READ_WRITE_TOKEN. " +
    "Vercel → Storage → Blob → ваш Store → .env.local (скопировать токен) → " +
    "Project → Settings → Environment Variables → добавить BLOB_READ_WRITE_TOKEN → Redeploy."
  );
}

export function blobUploadConstraints() {
  return {
    allowedContentTypes: ["image/*", "video/*"] as string[],
    maximumSizeInBytes: env.uploadMaxMb() * 1024 * 1024,
  };
}
