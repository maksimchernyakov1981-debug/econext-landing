/** Точка EcoNext: ул. Калараша, 43, Лазаревское (Яндекс Карты). */
export const ECONEXT_LAZAREVSKOYE = {
  lat: 43.90668,
  lon: 39.331666,
} as const;

const { lat, lon } = ECONEXT_LAZAREVSKOYE;

/** Ссылка с координатами — из неё лендинг строит маршрут в Картах и Навигаторе. */
const yandexPointUrl = `https://yandex.ru/maps/?pt=${lon},${lat}&z=17&l=map`;

export const mapStoreDefaults = {
  storeName: "EcoNext",
  address: "улица Калараша, 43, Лазаревское, Сочи, павильон EcoNext",
  landmark: "через дорогу от Магнита, по дороге к колесу обозрения",
  yandexMapsUrl: yandexPointUrl,
  yandexNavigatorUrl: yandexPointUrl,
  twoGisUrl:
    "https://2gis.ru/sochi/search/%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%9A%D0%B0%D0%BB%D0%B0%D1%80%D0%B0%D1%88%D0%B0%2043%20%D0%9B%D0%B0%D0%B7%D0%B0%D1%80%D0%B5%D0%B2%D1%81%D0%BA%D0%BE%D0%B5",
  googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`,
  mapDisplayMode: "yandex",
  mapSchemeCaption: "Схема прохода к торговой точке EcoNext",
};

export function mergeMapDefaultsIntoSnapshot<
  T extends { map: Record<string, unknown> },
>(current: T): T {
  return {
    ...current,
    map: {
      ...current.map,
      ...mapStoreDefaults,
      mapSchemeImageUrl: current.map.mapSchemeImageUrl ?? null,
      mapSchemeIsActive:
        typeof current.map.mapSchemeIsActive === "boolean"
          ? current.map.mapSchemeIsActive
          : true,
    },
  };
}
