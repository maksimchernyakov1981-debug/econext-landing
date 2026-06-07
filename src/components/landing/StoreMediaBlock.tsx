"use client";

import Image from "next/image";
import { resolveMediaUrl } from "@/lib/media-url";
import type { MediaAsset } from "@prisma/client";

export function StoreMediaBlock({
  title,
  items,
}: {
  title: string;
  items: MediaAsset[];
}) {
  if (!items.length) return null;

  return (
    <section className="mb-4">
      <h2 className="font-semibold mb-3">{title}</h2>
      <div className="space-y-4">
        {items.map((item) => {
          const src = resolveMediaUrl(item.url);
          if (!src) return null;

          const isVideo = item.type === "store_video";

          return (
            <figure
              key={item.id}
              className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm"
            >
              {isVideo ? (
                <video
                  src={src}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full max-h-[360px] bg-black"
                />
              ) : (
                <div className="relative w-full aspect-[4/3] bg-gray-100">
                  <Image
                    src={src}
                    alt={item.altText || item.title || "Фото точки EcoNext"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 512px) 100vw, 512px"
                    unoptimized={src.startsWith("/api/")}
                  />
                </div>
              )}
              {(item.title || item.altText) && (
                <figcaption className="px-3 py-2 text-xs text-muted text-center">
                  {item.title || item.altText}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
    </section>
  );
}
