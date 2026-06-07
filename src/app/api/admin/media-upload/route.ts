import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { env } from "@/lib/env";
import { isBlobStorageConfigured } from "@/lib/db-persist";
import { createMediaFromBuffer, persistMediaAfterUpload } from "@/lib/media-upload";
import { resolveUploadMime, UPLOAD_MIME_ALLOW } from "@/lib/upload-mime";

export const maxDuration = 60;

const STORE_TYPES = new Set(["store_photo", "store_video", "landmark_photo"]);

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.VERCEL === "1" && !isBlobStorageConfigured()) {
    return NextResponse.json(
      {
        error:
          "На Vercel нужен Blob Storage. Vercel → Storage → Blob → Connect to Project, затем Redeploy.",
      },
      { status: 503 }
    );
  }

  const form = await request.formData();
  const mediaType = String(form.get("type") ?? "store_photo");
  if (!STORE_TYPES.has(mediaType)) {
    return NextResponse.json({ error: "Неверный тип медиа" }, { status: 400 });
  }

  const files = [
    ...form.getAll("files"),
    ...form.getAll("file"),
  ].filter((f): f is File => f instanceof File && f.size > 0);

  if (!files.length) {
    return NextResponse.json({ error: "Выберите файл(ы)" }, { status: 400 });
  }

  const maxBytes = env.uploadMaxMb() * 1024 * 1024;
  const saved: { id: number; url: string; title: string | null }[] = [];
  const errors: string[] = [];

  for (const file of files) {
    if (file.size > maxBytes) {
      errors.push(`${file.name}: слишком большой (макс. ${env.uploadMaxMb()} МБ)`);
      continue;
    }

    const mime = resolveUploadMime(file);
    if (!mime || !UPLOAD_MIME_ALLOW.has(mime)) {
      errors.push(`${file.name}: неподдерживаемый формат`);
      continue;
    }

    const resolvedType =
      mediaType === "store_photo" && mime.startsWith("video/")
        ? "store_video"
        : mediaType === "store_video" && mime.startsWith("image/")
          ? "store_photo"
          : mediaType;

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const asset = await createMediaFromBuffer({
        buffer,
        mime,
        type: resolvedType,
        title: file.name.replace(/\.[^.]+$/, ""),
      });
      saved.push({ id: asset.id, url: asset.url, title: asset.title });
    } catch (e) {
      errors.push(
        `${file.name}: ${e instanceof Error ? e.message : "ошибка загрузки"}`
      );
    }
  }

  if (!saved.length) {
    return NextResponse.json(
      { error: errors.join("; ") || "Не удалось загрузить" },
      { status: 400 }
    );
  }

  const persist = await persistMediaAfterUpload();
  if (!persist.ok) {
    return NextResponse.json(
      { saved, errors, warning: persist.error },
      { status: 207 }
    );
  }

  return NextResponse.json({ ok: true, saved, errors });
}
