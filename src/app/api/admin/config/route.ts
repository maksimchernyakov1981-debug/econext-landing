import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  blobClientUploadSetupHint,
  canUseBlobClientUpload,
} from "@/lib/blob-auth";
import { isBlobStorageConfigured } from "@/lib/db-persist";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hasToken = canUseBlobClientUpload();
  const isVercel = process.env.VERCEL === "1";
  const hasStoreId = Boolean(process.env.BLOB_STORE_ID?.trim());

  return NextResponse.json({
    blobConfigured: isBlobStorageConfigured(),
    blobDirectUploadReady: hasToken,
    isVercel,
    hasToken,
    hasStoreId,
    setupHint:
      isVercel && !hasToken
        ? hasStoreId
          ? `${blobClientUploadSetupHint()} (OIDC подключён, но для загрузки с браузера нужен отдельный read-write token.)`
          : blobClientUploadSetupHint()
        : null,
  });
}
