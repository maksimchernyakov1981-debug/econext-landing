import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { env } from "@/lib/env";
import { storeUploadedFile } from "@/lib/upload-storage";
import {
  extForMime,
  resolveUploadMime,
  UPLOAD_MIME_ALLOW,
} from "@/lib/upload-mime";

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file") as File | null;
  const type = String(form.get("type") ?? "misc");

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  const mime = resolveUploadMime(file);
  if (!mime || !UPLOAD_MIME_ALLOW.has(mime)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const maxBytes = env.uploadMaxMb() * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  const ext = extForMime(mime);
  const name = `${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const url = await storeUploadedFile(type, name, buffer, mime);
    return NextResponse.json({ url });
  } catch (e) {
    console.error("[upload]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Ошибка загрузки" },
      { status: 500 }
    );
  }
}
