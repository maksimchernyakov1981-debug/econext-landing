import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { isBlobStorageConfigured } from "@/lib/db-persist";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const hasToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
  return NextResponse.json({
    blobConfigured: isBlobStorageConfigured(),
    /** Прямая загрузка больших файлов с браузера в Blob */
    blobDirectUploadReady: hasToken,
    isVercel: process.env.VERCEL === "1",
    hasToken,
    hasStoreId: Boolean(process.env.BLOB_STORE_ID?.trim()),
  });
}
