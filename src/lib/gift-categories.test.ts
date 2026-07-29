import { describe, expect, it } from "vitest";
import {
  getGiftCategories,
  giftCategoryDefaults,
  normalizeGiftCategorySettings,
  parseGiftCategoryItems,
} from "./gift-categories";

describe("gift categories", () => {
  it("normalizes missing settings from an old snapshot", () => {
    const normalized = normalizeGiftCategorySettings({ title: "Каталог" });

    expect(normalized.title).toBe("Каталог");
    expect(normalized.giftForHerTitle).toBe(giftCategoryDefaults.giftForHerTitle);
    expect(normalized.giftCategoryCtaText).toBe(
      giftCategoryDefaults.giftCategoryCtaText
    );
  });

  it("parses one item per line and removes empty lines", () => {
    expect(parseGiftCategoryItems("Тюрбан\n\n Полотенце \r\nМочалка")).toEqual([
      "Тюрбан",
      "Полотенце",
      "Мочалка",
    ]);
  });

  it("builds all three category views", () => {
    const settings = normalizeGiftCategorySettings({});
    const categories = getGiftCategories(settings);

    expect(categories.map((category) => category.key)).toEqual([
      "her",
      "home",
      "auto",
    ]);
    expect(categories.every((category) => category.items.length > 0)).toBe(true);
  });
});
