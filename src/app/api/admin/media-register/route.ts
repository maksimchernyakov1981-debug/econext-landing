import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { persistMediaAfterUpload } from "@/lib/media-upload";
import { prisma } from "@/lib/prisma";
import { ensurePrismaSyncedFromBlob } from "@/lib/settings-backup";

const STORE_TYPES = new Set(["store_photo", "store_video", "landmark_photo"]);

/** Сохранить в БД URL после прямой загрузки в Vercel Blob (для больших видео). */
export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const url = String(body.url ?? "").trim();
  const type = String(body.type ?? "store_photo");
  const title = String(body.title ?? "").trim() || null;

  if (!url) {
    return NextResponse.json({ error: "Нет URL" }, { status: 400 });
  }
  if (!STORE_TYPES.has(type)) {
    return NextResponse.json({ error: "Неверный тип" }, { status: 400 });
  }

  await ensurePrismaSyncedFromBlob();

  const maxOrder = await prisma.mediaAsset.aggregate({ _max: { sortOrder: true } });
  const asset = await prisma.mediaAsset.create({
    data: {
      type,
      title,
      url,
      altText: null,
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      isActive: true,
    },
  });

  const persist = await persistMediaAfterUpload();
  if (!persist.ok) {
    return NextResponse.json(
      { id: asset.id, url: asset.url, warning: persist.error },
      { status: 207 }
    );
  }

  return NextResponse.json({ ok: true, id: asset.id, url: asset.url, title: asset.title });
}
