import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { isBlobStorageConfigured } from "@/lib/db-persist";
import { env } from "@/lib/env";
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
  const clientMime = typeof body.mime === "string" ? body.mime : "";

  const mime = resolveUploadMime({ type: clientMime, name: filename });
  if (!mime || !UPLOAD_MIME_ALLOW.has(mime)) {
    return NextResponse.json({ error: "Неподдерживаемый формат" }, { status: 400 });
  }

  const ext = extForMime(mime);
  const pathname = `uploads/${mediaType}/${crypto.randomUUID()}.${ext}`;

  const rwToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!rwToken) {
    return NextResponse.json(
      {
        error:
          "BLOB_READ_WRITE_TOKEN не найден. Vercel → Storage → Blob → Connect to Project, затем Redeploy.",
      },
      { status: 503 }
    );
  }

  try {
    const clientToken = await generateClientTokenFromReadWriteToken({
      pathname,
      allowedContentTypes: ["image/*", "video/*"],
      maximumSizeInBytes: env.uploadMaxMb() * 1024 * 1024,
      addRandomSuffix: false,
      token: rwToken,
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
