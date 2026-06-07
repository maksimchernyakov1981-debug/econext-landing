import type { MapSettings } from "@prisma/client";
import type { WorkStatusResult } from "@/lib/schedule/types";
import {
  buildYandexMapButtonLinks,
  type YandexRouteLink,
} from "./yandex-route-links";

function pickUrl(
  primary: string | null | undefined,
  fallback: string | null | undefined
): string | null {
  const p = primary?.trim();
  if (p) return p;
  const f = fallback?.trim();
  return f || null;
}

export type ResolvedMapLinks = WorkStatusResult["mapLinks"] & {
  yandexMapsRoute: YandexRouteLink | null;
  yandexNavigatorRoute: YandexRouteLink | null;
};

/** Ссылки карт: workStatus + запасной вариант из MapSettings. Яндекс — с маршрутом. */
export function resolveMapLinks(
  workStatusLinks: WorkStatusResult["mapLinks"],
  map: MapSettings,
  address?: string
): ResolvedMapLinks {
  const yandexMapsUrl = pickUrl(workStatusLinks.yandexMapsUrl, map.yandexMapsUrl);
  const yandexNavigatorUrl = pickUrl(
    workStatusLinks.yandexNavigatorUrl,
    map.yandexNavigatorUrl
  );
  const addr = address?.trim() || map.address?.trim() || "";

  const yandex = buildYandexMapButtonLinks(yandexMapsUrl, yandexNavigatorUrl, addr);

  return {
    yandexMapsUrl: yandex.yandexMaps?.webUrl ?? yandexMapsUrl,
    yandexNavigatorUrl: yandex.yandexNavigator?.appUrl ?? yandex.yandexNavigator?.webUrl ?? yandexNavigatorUrl,
    twoGisUrl: pickUrl(workStatusLinks.twoGisUrl, map.twoGisUrl),
    googleMapsUrl: pickUrl(workStatusLinks.googleMapsUrl, map.googleMapsUrl),
    yandexMapsRoute: yandex.yandexMaps,
    yandexNavigatorRoute: yandex.yandexNavigator,
  };
}

export function mapLinksFromSettings(map: MapSettings): ResolvedMapLinks {
  return resolveMapLinks(
    {
      yandexMapsUrl: map.yandexMapsUrl?.trim() || null,
      yandexNavigatorUrl: map.yandexNavigatorUrl?.trim() || null,
      twoGisUrl: map.twoGisUrl?.trim() || null,
      googleMapsUrl: map.googleMapsUrl?.trim() || null,
    },
    map,
    map.address
  );
}

/** Для особого дня: пустая строка в поле не перекрывает общие карты. */
export function mergeMapLinksForSpecialDay(
  special: {
    yandexMapsUrl?: string | null;
    yandexNavigatorUrl?: string | null;
    twoGisUrl?: string | null;
    googleMapsUrl?: string | null;
  },
  map: MapSettings,
  address?: string
): ResolvedMapLinks {
  return resolveMapLinks(
    {
      yandexMapsUrl: pickUrl(special.yandexMapsUrl, map.yandexMapsUrl),
      yandexNavigatorUrl: pickUrl(special.yandexNavigatorUrl, map.yandexNavigatorUrl),
      twoGisUrl: pickUrl(special.twoGisUrl, map.twoGisUrl),
      googleMapsUrl: pickUrl(special.googleMapsUrl, map.googleMapsUrl),
    },
    map,
    address
  );
}
