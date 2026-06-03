import type { MapSettings } from "@prisma/client";
import { resolveSchemeImageUrl } from "./media-url";

export type MapDisplayMode = "image" | "yandex" | "2gis" | "auto";

export type LocationMapView =
  | { type: "iframe"; embedUrl: string; caption: string | null }
  | { type: "image"; imageUrl: string; caption: string | null }
  | null;

/** Ссылка Яндекс.Карт → виджет с зумом и перемещением. */
export function yandexMapsEmbedUrl(mapsUrl: string): string | null {
  const raw = mapsUrl.trim();
  if (!raw) return null;

  try {
    if (raw.includes("map-widget")) {
      const u = new URL(raw);
      if (u.hostname.includes("yandex")) return raw;
    }

    const share = raw.match(/https?:\/\/yandex\.(ru|com)\/maps\/(.+)/i);
    if (share) {
      const tail = share[2].split("?")[0];
      return `https://yandex.ru/map-widget/v1/${tail}`;
    }

    const u = new URL(raw);
    const pt = u.searchParams.get("pt");
    const z = u.searchParams.get("z") ?? "16";
    if (pt) {
      const [lon, lat] = pt.split(",").map((s) => s.trim());
      if (lon && lat) {
        const ll = `${lon},${lat}`;
        return `https://yandex.ru/map-widget/v1/?ll=${encodeURIComponent(ll)}&z=${z}&pt=${encodeURIComponent(ll)}&l=map`;
      }
    }
  } catch {
    return null;
  }
  return null;
}

/** Ссылка 2ГИС → виджет фирмы/точки. */
export function twoGisEmbedUrl(mapsUrl: string): string | null {
  const raw = mapsUrl.trim();
  if (!raw) return null;

  try {
    if (raw.includes("/widget/")) {
      const u = new URL(raw);
      if (u.hostname.includes("2gis")) return raw;
    }

    const firm = raw.match(/https?:\/\/2gis\.(ru|com)\/[^/]+\/firm\/([^/?#]+)/i);
    if (firm) {
      return `https://2gis.ru/widget/firm/${firm[2]}`;
    }

    const geo = raw.match(/https?:\/\/2gis\.(ru|com)\/geo\/([^/?#]+)/i);
    if (geo) {
      return `https://2gis.ru/widget/geo/${geo[2]}`;
    }
  } catch {
    return null;
  }
  return null;
}

function schemeImageView(map: MapSettings): LocationMapView | null {
  if (!map.mapSchemeIsActive || !map.mapSchemeImageUrl?.trim()) return null;
  const imageUrl = resolveSchemeImageUrl(map.mapSchemeImageUrl);
  if (!imageUrl) return null;
  return {
    type: "image",
    imageUrl,
    caption: map.mapSchemeCaption,
  };
}

function yandexView(map: MapSettings): LocationMapView | null {
  if (!map.yandexMapsUrl?.trim()) return null;
  const embedUrl = yandexMapsEmbedUrl(map.yandexMapsUrl);
  if (!embedUrl) return null;
  return {
    type: "iframe",
    embedUrl,
    caption: map.mapSchemeCaption ?? "Яндекс Карты — можно увеличивать и двигать",
  };
}

function twoGisView(map: MapSettings): LocationMapView | null {
  if (!map.twoGisUrl?.trim()) return null;
  const embedUrl = twoGisEmbedUrl(map.twoGisUrl);
  if (!embedUrl) return null;
  return {
    type: "iframe",
    embedUrl,
    caption: map.mapSchemeCaption ?? "2ГИС — можно увеличивать и двигать",
  };
}

/** Что показать в блоке «Схема / карта» на лендинге. */
export function resolveLocationMap(map: MapSettings): LocationMapView | null {
  const mode = (map.mapDisplayMode as MapDisplayMode) || "image";

  if (mode === "yandex") return yandexView(map) ?? schemeImageView(map);
  if (mode === "2gis") return twoGisView(map) ?? schemeImageView(map);
  if (mode === "image") return schemeImageView(map);

  return yandexView(map) ?? twoGisView(map) ?? schemeImageView(map);
}
