export type YandexCoords = { lat: number; lon: number };

export type RouteTarget = YandexCoords | { address: string };

export type YandexRouteLink = {
  /** HTTPS — открывает Яндекс Карты в браузере или предлагает приложение Карт. */
  webUrl: string;
  /** Deep link в нативное приложение (yandexmaps:// / yandexnavi://). */
  appUrl: string | null;
};

/** Извлечь координаты из ссылки Яндекса (pt, ll, rtext). */
export function parseYandexCoordsFromUrl(url: string): YandexCoords | null {
  const raw = url?.trim();
  if (!raw) return null;

  try {
    const u = new URL(raw);

    const pt = u.searchParams.get("pt");
    if (pt) {
      const [lon, lat] = pt.split(",").map((s) => parseFloat(s.trim()));
      if (Number.isFinite(lat) && Number.isFinite(lon)) return { lat, lon };
    }

    const ll = u.searchParams.get("ll");
    if (ll) {
      const [lon, lat] = ll.split(",").map((s) => parseFloat(s.trim()));
      if (Number.isFinite(lat) && Number.isFinite(lon)) return { lat, lon };
    }

    const rtext = u.searchParams.get("rtext");
    if (rtext) {
      const dest = rtext.split("~").filter(Boolean).pop() ?? rtext.replace(/^~/, "");
      const [a, b] = dest.split(",").map((s) => parseFloat(s.trim()));
      if (Number.isFinite(a) && Number.isFinite(b)) return { lat: a, lon: b };
    }
  } catch {
    return null;
  }

  return null;
}

export function resolveRouteTarget(
  mapsUrl: string | null | undefined,
  navigatorUrl: string | null | undefined,
  address: string
): RouteTarget | null {
  const coords =
    parseYandexCoordsFromUrl(mapsUrl ?? "") ??
    parseYandexCoordsFromUrl(navigatorUrl ?? "");
  if (coords) return coords;

  const addr = address.trim();
  if (addr) return { address: addr };

  return null;
}

/** Маршрут в Яндекс Картах (от текущего местоположения). */
export function buildYandexMapsRouteLink(target: RouteTarget): YandexRouteLink {
  if ("lat" in target) {
    const rtext = `~${target.lat},${target.lon}`;
    return {
      webUrl: `https://yandex.ru/maps/?rtext=${encodeURIComponent(rtext)}&rtt=auto`,
      appUrl: `yandexmaps://build_route_on_map?lat_to=${target.lat}&lon_to=${target.lon}`,
    };
  }

  const rtext = `~${target.address}`;
  return {
    webUrl: `https://yandex.ru/maps/?rtext=${encodeURIComponent(rtext)}&rtt=auto`,
    appUrl: null,
  };
}

/** Маршрут в Яндекс Навигаторе (отдельное приложение). */
export function buildYandexNavigatorRouteLink(target: RouteTarget): YandexRouteLink {
  if ("lat" in target) {
    return {
      webUrl: `https://yandex.ru/maps/?rtext=${encodeURIComponent(`~${target.lat},${target.lon}`)}&rtt=auto`,
      appUrl: `yandexnavi://build_route_on_map?lat_to=${target.lat}&lon_to=${target.lon}`,
    };
  }

  const text = encodeURIComponent(target.address);
  return {
    webUrl: `https://yandex.ru/maps/?rtext=${encodeURIComponent(`~${target.address}`)}&rtt=auto`,
    appUrl: `yandexnavi://map_search?text=${text}`,
  };
}

export function buildYandexMapButtonLinks(
  mapsUrl: string | null | undefined,
  navigatorUrl: string | null | undefined,
  address: string
): {
  yandexMaps: YandexRouteLink | null;
  yandexNavigator: YandexRouteLink | null;
} {
  const hasMaps = Boolean(mapsUrl?.trim());
  const hasNavigator = Boolean(navigatorUrl?.trim());
  if (!hasMaps && !hasNavigator) {
    return { yandexMaps: null, yandexNavigator: null };
  }

  const target = resolveRouteTarget(mapsUrl, navigatorUrl, address);
  if (!target) {
    return { yandexMaps: null, yandexNavigator: null };
  }

  return {
    yandexMaps: hasMaps ? buildYandexMapsRouteLink(target) : null,
    yandexNavigator: hasNavigator ? buildYandexNavigatorRouteLink(target) : null,
  };
}
