import { env } from "./env";

/** Read-write token для handleUpload (legacy). OIDC не подходит для этого метода. */
export function getBlobReadWriteToken(): string | null {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  return token || null;
}

/** Presigned client upload через OIDC (BLOB_STORE_ID + BLOB_WEBHOOK_PUBLIC_KEY на Vercel). */
export function canUseBlobPresignedUpload(): boolean {
  return (
    process.env.VERCEL === "1" &&
    Boolean(process.env.BLOB_STORE_ID?.trim()) &&
    Boolean(process.env.BLOB_WEBHOOK_PUBLIC_KEY?.trim())
  );
}

export type BlobUploadMode = "token" | "presigned" | "none";

export function getBlobUploadMode(): BlobUploadMode {
  if (getBlobReadWriteToken()) return "token";
  if (canUseBlobPresignedUpload()) return "presigned";
  return "none";
}

export function canUseBlobClientUpload(): boolean {
  return getBlobUploadMode() !== "none";
}

export function blobClientUploadSetupHint(): string {
  return (
    "Для видео >4 МБ подключите Vercel Blob к проекту: " +
    "Storage → Blob → Connect to Project → Redeploy. " +
    "Либо добавьте BLOB_READ_WRITE_TOKEN из вкладки .env.local у Store."
  );
}

export function blobUploadConstraints() {
  return {
    allowedContentTypes: ["image/*", "video/*"] as string[],
    maximumSizeInBytes: env.uploadMaxMb() * 1024 * 1024,
  };
}
