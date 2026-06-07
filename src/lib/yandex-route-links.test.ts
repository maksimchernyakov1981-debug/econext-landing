import { describe, expect, it } from "vitest";
import {
  buildYandexMapsRouteLink,
  buildYandexNavigatorRouteLink,
  parseYandexCoordsFromUrl,
} from "./yandex-route-links";

describe("parseYandexCoordsFromUrl", () => {
  it("reads pt as lon,lat", () => {
    expect(parseYandexCoordsFromUrl("https://yandex.ru/maps/?pt=39.33,43.91&z=17")).toEqual({
      lat: 43.91,
      lon: 39.33,
    });
  });

  it("reads rtext destination as lat,lon", () => {
    expect(
      parseYandexCoordsFromUrl("https://yandex.ru/maps/?rtext=~43.91,39.33&rtt=auto")
    ).toEqual({ lat: 43.91, lon: 39.33 });
  });
});

describe("buildYandexMapsRouteLink", () => {
  it("builds route with rtext and maps app deep link", () => {
    const link = buildYandexMapsRouteLink({ lat: 43.91, lon: 39.33 });
    expect(link.webUrl).toContain("rtext=");
    expect(link.webUrl).toContain("rtt=auto");
    expect(link.appUrl).toBe("yandexmaps://build_route_on_map?lat_to=43.91&lon_to=39.33");
  });
});

describe("buildYandexNavigatorRouteLink", () => {
  it("uses yandexnavi scheme, not yandexmaps", () => {
    const link = buildYandexNavigatorRouteLink({ lat: 43.91, lon: 39.33 });
    expect(link.appUrl).toBe("yandexnavi://build_route_on_map?lat_to=43.91&lon_to=39.33");
    expect(link.appUrl).not.toContain("yandexmaps");
  });
});
