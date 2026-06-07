import { describe, expect, it } from "vitest";
import {
  buildYandexMapsRouteLink,
  buildYandexNavigatorRouteLink,
  parseYandexCoordsFromUrl,
  yandexMapsAppRouteUrl,
  yandexNavigatorAppRouteUrl,
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

describe("yandexMapsAppRouteUrl", () => {
  it("uses yandexmaps://maps.yandex.ru with rtext per Yandex docs", () => {
    const url = yandexMapsAppRouteUrl(43.91, 39.33);
    expect(url).toMatch(/^yandexmaps:\/\/maps\.yandex\.ru\/\?/);
    expect(url).toContain("rtext=");
    expect(url).toContain("rtt=auto");
    expect(url).not.toContain("build_route_on_map");
    expect(url).not.toContain("yandexnavi");
  });
});

describe("buildYandexMapsRouteLink", () => {
  it("builds maps app link separate from navigator", () => {
    const link = buildYandexMapsRouteLink({ lat: 43.91, lon: 39.33 });
    expect(link.appUrl).toBe(yandexMapsAppRouteUrl(43.91, 39.33));
    expect(link.appUrl).not.toContain("yandexnavi");
  });
});

describe("buildYandexNavigatorRouteLink", () => {
  it("uses yandexnavi build_route_on_map, not yandexmaps", () => {
    const link = buildYandexNavigatorRouteLink({ lat: 43.91, lon: 39.33 });
    expect(link.appUrl).toBe(yandexNavigatorAppRouteUrl(43.91, 39.33));
    expect(link.appUrl).toMatch(/^yandexnavi:\/\//);
    expect(link.appUrl).not.toContain("yandexmaps");
  });
});
