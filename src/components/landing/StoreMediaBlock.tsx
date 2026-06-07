"use client";

import { resolveMediaUrl } from "@/lib/media-url";
import type { MediaAsset } from "@prisma/client";
import { ZoomableImage } from "./ZoomableImage";
import { ZoomableVideo } from "./ZoomableVideo";

export function StoreMediaBlock({
  title,
  items,
  embedded = false,
}: {
  title: string;
  items: MediaAsset[];
  embedded?: boolean;
}) {
  if (!items.length) return null;

  return (
    <section className={embedded ? "" : "mb-4"}>
      <h2 className={`font-semibold mb-3 ${embedded ? "text-base" : ""}`}>{title}</h2>
      <div className="space-y-4">
        {items.map((item) => {
          const src = resolveMediaUrl(item.url);
          if (!src) return null;

          const isVideo = item.type === "store_video";
          const label = item.title || item.altText || undefined;

          return (
            <figure
              key={item.id}
              className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm p-2"
            >
              {isVideo ? (
                <ZoomableVideo src={src} caption={label} />
              ) : (
                <ZoomableImage
                  src={src}
                  alt={item.altText || item.title || "Фото точки EcoNext"}
                  caption={label}
                  previewClassName="max-h-[280px]"
                  hint="Нажмите — полный экран и увеличение"
                />
              )}
            </figure>
          );
        })}
      </div>
    </section>
  );
}
