import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  blobClientUploadSetupHint,
  canUseBlobClientUpload,
  getBlobUploadMode,
} from "@/lib/blob-auth";
import { isBlobStorageConfigured } from "@/lib/db-persist";
import { getPublicSiteUrl } from "@/lib/public-site-url";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mode = getBlobUploadMode();
  const isVercel = process.env.VERCEL === "1";

  return NextResponse.json({
    blobConfigured: isBlobStorageConfigured(),
    blobDirectUploadReady: canUseBlobClientUpload(),
    blobUploadMode: mode,
    isVercel,
    hasToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim()),
    hasStoreId: Boolean(process.env.BLOB_STORE_ID?.trim()),
    hasWebhookKey: Boolean(process.env.BLOB_WEBHOOK_PUBLIC_KEY?.trim()),
    setupHint: isVercel && mode === "none" ? blobClientUploadSetupHint() : null,
    publicSiteUrl: getPublicSiteUrl(),
    qrUrlHint:
      "QR должен вести на publicSiteUrl. Если гости видят «войти в Vercel» — перескачайте QR и отключите Deployment Protection в настройках Vercel.",
  });
}
