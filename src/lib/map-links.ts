import type { MapSettings } from "@prisma/client";
import type { WorkStatusResult } from "@/lib/schedule/types";

function pickUrl(
  primary: string | null | undefined,
  fallback: string | null | undefined
): string | null {
  const p = primary?.trim();
  if (p) return p;
  const f = fallback?.trim();
  return f || null;
}

/** Ссылки карт: workStatus + запасной вариант из MapSettings. */
export function resolveMapLinks(
  workStatusLinks: WorkStatusResult["mapLinks"],
  map: MapSettings
): WorkStatusResult["mapLinks"] {
  return {
    yandexMapsUrl: pickUrl(workStatusLinks.yandexMapsUrl, map.yandexMapsUrl),
    yandexNavigatorUrl: pickUrl(
      workStatusLinks.yandexNavigatorUrl,
      map.yandexNavigatorUrl
    ),
    twoGisUrl: pickUrl(workStatusLinks.twoGisUrl, map.twoGisUrl),
    googleMapsUrl: pickUrl(workStatusLinks.googleMapsUrl, map.googleMapsUrl),
  };
}

export function mapLinksFromSettings(map: MapSettings): WorkStatusResult["mapLinks"] {
  return {
    yandexMapsUrl: map.yandexMapsUrl?.trim() || null,
    yandexNavigatorUrl: map.yandexNavigatorUrl?.trim() || null,
    twoGisUrl: map.twoGisUrl?.trim() || null,
    googleMapsUrl: map.googleMapsUrl?.trim() || null,
  };
}

/** Для особого дня: пустая строка в поле не перекрывает общие карты. */
export function mergeMapLinksForSpecialDay(
  special: {
    yandexMapsUrl?: string | null;
    yandexNavigatorUrl?: string | null;
    twoGisUrl?: string | null;
    googleMapsUrl?: string | null;
  },
  map: MapSettings
): WorkStatusResult["mapLinks"] {
  return {
    yandexMapsUrl: pickUrl(special.yandexMapsUrl, map.yandexMapsUrl),
    yandexNavigatorUrl: pickUrl(special.yandexNavigatorUrl, map.yandexNavigatorUrl),
    twoGisUrl: pickUrl(special.twoGisUrl, map.twoGisUrl),
    googleMapsUrl: pickUrl(special.googleMapsUrl, map.googleMapsUrl),
  };
}
