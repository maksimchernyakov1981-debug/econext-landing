import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { isBlobStorageConfigured } from "@/lib/db-persist";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    blobConfigured: isBlobStorageConfigured(),
    isVercel: process.env.VERCEL === "1",
    hasToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim()),
    hasStoreId: Boolean(process.env.BLOB_STORE_ID?.trim()),
  });
}
