import { describe, expect, it } from "vitest";
import { twoGisEmbedUrl, yandexMapsEmbedUrl } from "./map-embed";

describe("yandexMapsEmbedUrl", () => {
  it("converts share link to widget", () => {
    const url = yandexMapsEmbedUrl("https://yandex.ru/maps/-/CLcXn8y1");
    expect(url).toBe("https://yandex.ru/map-widget/v1/-/CLcXn8y1");
  });

  it("builds widget from pt coordinates", () => {
    const url = yandexMapsEmbedUrl("https://yandex.ru/maps/?pt=39.7,43.5&z=17");
    expect(url).toContain("map-widget");
    expect(url).toContain("39.7");
  });
});

describe("twoGisEmbedUrl", () => {
  it("converts firm link to widget", () => {
    const url = twoGisEmbedUrl("https://2gis.ru/sochi/firm/12345/tab/map");
    expect(url).toBe("https://2gis.ru/widget/firm/12345");
  });
});
