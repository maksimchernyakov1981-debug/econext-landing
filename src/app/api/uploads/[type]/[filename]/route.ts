import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getUploadRoot } from "@/lib/uploads";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string; filename: string }> }
) {
  const { type, filename } = await params;
  const filePath = path.join(getUploadRoot(), type, filename);

  try {
    const buf = await readFile(filePath);
    const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
    return new NextResponse(buf, {
      headers: {
        "Content-Type": MIME[ext] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
