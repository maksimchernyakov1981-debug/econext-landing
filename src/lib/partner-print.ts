import { offerQrPrintTexts } from "@/lib/offer-texts";

/** Типы партнёров для QR-листовок (значения в БД — на английском). */
export const PARTNER_TYPE_OPTIONS = [
  { value: "hotel", label: "Гостиница" },
  { value: "sanatorium", label: "Санаторий" },
  { value: "cafe", label: "Кафе" },
  { value: "restaurant", label: "Ресторан" },
  { value: "shop", label: "Магазин / торговая точка" },
  { value: "other", label: "Другое место" },
] as const;

const PARTNER_TYPE_PRINT_PREFIX: Record<string, string> = {
  hotel: "В гостинице",
  sanatorium: "В санатории",
  cafe: "В кафе",
  restaurant: "В ресторане",
  shop: "В",
  other: "",
};

const TYPE_WORD_IN_NAME: Record<string, string[]> = {
  hotel: ["гостиниц"],
  sanatorium: ["санатор"],
  cafe: ["кафе"],
  restaurant: ["ресторан"],
  shop: ["магазин", "торгов"],
};

/** Строка «где стоит QR» — подставляется имя конкретного партнёра. */
export function formatPartnerPrintLocation(partnerType: string, partnerName: string): string {
  const name = partnerName.trim();
  if (!name) return offerQrPrintTexts.printPartnerFallback;

  const type = partnerType.trim() || "other";
  const prefix = PARTNER_TYPE_PRINT_PREFIX[type] ?? "";
  const nameLower = name.toLowerCase();
  const redundant = (TYPE_WORD_IN_NAME[type] ?? []).some((w) => nameLower.includes(w));

  if (!prefix || redundant) return name;
  if (type === "shop") return `${prefix} ${name}`;
  return `${prefix} ${name}`;
}
