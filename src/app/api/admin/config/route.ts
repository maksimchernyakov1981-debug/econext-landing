import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim()),
    isVercel: process.env.VERCEL === "1",
  });
}
