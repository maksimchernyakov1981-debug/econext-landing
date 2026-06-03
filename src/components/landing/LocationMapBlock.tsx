"use client";

import type { LocationMapView } from "@/lib/map-embed";
import { ZoomableImage } from "./ZoomableImage";

export function LocationMapBlock({
  view,
  title,
}: {
  view: LocationMapView;
  title?: string | null;
}) {
  if (!view) return null;

  return (
    <section className="mb-4">
      {title && <h2 className="font-semibold mb-2">{title}</h2>}

      {view.type === "iframe" ? (
        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
          <iframe
            title="Карта проезда"
            src={view.embedUrl}
            className="w-full border-0"
            style={{ height: "min(70vh, 360px)" }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
          <p className="text-xs text-center text-muted py-2 px-2">
            Двигайте и увеличивайте карту пальцами. Открыть в приложении — кнопка «Как
            добраться» ниже.
          </p>
        </div>
      ) : (
        <ZoomableImage
          src={view.imageUrl}
          alt={view.caption ?? "Схема прохода"}
          caption={view.caption}
        />
      )}
    </section>
  );
}
