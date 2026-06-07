"use client";

import { resolveMediaUrl } from "@/lib/media-url";
import { storeMediaSubtitle } from "@/lib/landing-marketing";
import type { MediaAsset } from "@prisma/client";
import { ZoomableImage } from "./ZoomableImage";
import { ZoomableVideo } from "./ZoomableVideo";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FILE_RE = /^[\w-]+\.(jpe?g|png|webp|gif|mp4|mov|webm)$/i;

function shouldShowCaption(label?: string | null): boolean {
  if (!label?.trim()) return false;
  const t = label.trim();
  if (UUID_RE.test(t)) return false;
  if (FILE_RE.test(t)) return false;
  if (t.length > 48 && /[0-9a-f-]{20,}/i.test(t)) return false;
  return true;
}

export function StoreMediaBlock({
  title,
  subtitle = storeMediaSubtitle,
  items,
  embedded = false,
}: {
  title: string;
  subtitle?: string;
  items: MediaAsset[];
  embedded?: boolean;
}) {
  if (!items.length) return null;

  return (
    <section className={embedded ? "" : "mb-5"}>
      <h2 className={`font-bold text-gray-900 ${embedded ? "text-base" : "text-lg"}`}>
        {title}
      </h2>
      {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
      <div className="mt-4 space-y-4">
        {items.map((item) => {
          const src = resolveMediaUrl(item.url);
          if (!src) return null;

          const isVideo = item.type === "store_video";
          const rawLabel = item.title || item.altText || null;
          const caption = shouldShowCaption(rawLabel) ? rawLabel : undefined;

          return (
            <figure
              key={item.id}
              className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm p-2"
            >
              {isVideo ? (
                <ZoomableVideo src={src} caption={caption} />
              ) : (
                <ZoomableImage
                  src={src}
                  alt={item.altText || item.title || "Фото точки EcoNext"}
                  caption={caption}
                  hint="Нажмите на фото, чтобы увеличить"
                  previewClassName="max-h-[280px]"
                />
              )}
            </figure>
          );
        })}
      </div>
    </section>
  );
}
