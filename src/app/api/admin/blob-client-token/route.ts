import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { isBlobStorageConfigured } from "@/lib/db-persist";
import { extForMime, resolveUploadMime, UPLOAD_MIME_ALLOW } from "@/lib/upload-mime";

export const maxDuration = 30;

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isBlobStorageConfigured()) {
    return NextResponse.json(
      { error: "Blob Storage не подключён на Vercel" },
      { status: 503 }
    );
  }

  const body = await request.json();
  const filename = String(body.filename ?? "file.bin");
  const mediaType = String(body.type ?? "store_photo");
  const multipart = Boolean(body.multipart);

  const mime = resolveUploadMime({ type: "", name: filename });
  if (!mime || !UPLOAD_MIME_ALLOW.has(mime)) {
    return NextResponse.json({ error: "Неподдерживаемый формат" }, { status: 400 });
  }

  const ext = extForMime(mime);
  const pathname = `uploads/${mediaType}/${crypto.randomUUID()}.${ext}`;

  try {
    const clientToken = await generateClientTokenFromReadWriteToken({
      pathname,
      allowedContentTypes: [...UPLOAD_MIME_ALLOW],
      maximumSizeInBytes: 100 * 1024 * 1024,
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN?.trim(),
    });

    return NextResponse.json({ clientToken, pathname, mime });
  } catch (e) {
    console.error("[blob-client-token]", e);
    return NextResponse.json(
      {
        error:
          e instanceof Error
            ? e.message
            : "Не удалось создать токен загрузки. Проверьте Blob Storage.",
      },
      { status: 500 }
    );
  }
}
