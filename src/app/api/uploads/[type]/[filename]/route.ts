import { NextResponse } from "next/server";
import { readUploadedFile } from "@/lib/upload-storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string; filename: string }> }
) {
  const { type, filename } = await params;
  const file = await readUploadedFile(type, filename);
  if (!file) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(new Uint8Array(file.buffer), {
    headers: {
      "Content-Type": file.contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
