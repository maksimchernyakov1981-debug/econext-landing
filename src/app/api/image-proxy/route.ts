import { NextResponse } from "next/server";
import { isAllowedImageProxyUrl } from "@/lib/media-url";

export async function GET(request: Request) {
  const src = new URL(request.url).searchParams.get("src");
  if (!src || !isAllowedImageProxyUrl(src)) {
    return new NextResponse("Bad request", { status: 400 });
  }

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
    const res = await fetch(src, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });
    if (!res.ok) return new NextResponse("Not found", { status: 404 });

    const buf = await res.arrayBuffer();
    return new NextResponse(buf, {
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (e) {
    console.error("[image-proxy]", e);
    return new NextResponse("Error", { status: 500 });
  }
}
