export const giftCategoryDefaults = {
  giftCategoryTitle: "Выберите, для кого или для чего подарок",
  giftCategoryDescription:
    "Нажмите на категорию — покажем подходящие товары и способы заказа.",
  giftForHerTitle: "Для неё",
  giftForHerItems:
    "Тюрбан для волос\nПолотенце Макси\nМочалки для тела\nГотовые подарочные наборы",
  giftHomeTitle: "Для дома",
  giftHomeItems:
    "Коврики Шиншилла\nНабор для кухни\nСалфетки для стекла и зеркал\nТовары для уборки дома",
  giftAutoTitle: "Для авто",
  giftAutoItems:
    "Автонаборы\nСалфетки для стекла и зеркал\nУниверсальные салфетки\nТовары для ухода за машиной",
  giftCategoryCtaText: "Подобрать подарок",
} as const;

export type GiftCategoryKey = "her" | "home" | "auto";

export type GiftCategorySettings = {
  [K in keyof typeof giftCategoryDefaults]: string;
};

export type GiftCategoryView = {
  key: GiftCategoryKey;
  icon: string;
  title: string;
  items: string[];
  eventType: string;
};

function nonEmptyString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function normalizeGiftCategorySettings<T extends object>(
  catalog: T
): T & GiftCategorySettings {
  const source = catalog as Record<string, unknown>;
  const normalized = Object.fromEntries(
    Object.entries(giftCategoryDefaults).map(([key, fallback]) => [
      key,
      nonEmptyString(source[key], fallback),
    ])
  ) as GiftCategorySettings;

  return { ...catalog, ...normalized };
}

export function parseGiftCategoryItems(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

export function getGiftCategories(
  catalog: GiftCategorySettings
): GiftCategoryView[] {
  return [
    {
      key: "her",
      icon: "🎁",
      title: catalog.giftForHerTitle,
      items: parseGiftCategoryItems(catalog.giftForHerItems),
      eventType: "select_gift_category_her",
    },
    {
      key: "home",
      icon: "🏠",
      title: catalog.giftHomeTitle,
      items: parseGiftCategoryItems(catalog.giftHomeItems),
      eventType: "select_gift_category_home",
    },
    {
      key: "auto",
      icon: "🚗",
      title: catalog.giftAutoTitle,
      items: parseGiftCategoryItems(catalog.giftAutoItems),
      eventType: "select_gift_category_auto",
    },
  ];
}
