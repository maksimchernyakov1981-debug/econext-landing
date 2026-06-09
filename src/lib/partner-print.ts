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

function tpl(text: string, partnerName: string) {
  return text.replace(/\[partner_name\]/g, partnerName);
}

/** Верхняя строка листовки: коллаборация EcoNext и партнёра. */
export function formatPartnerPrintCollaboration(partnerName: string): string {
  const name = partnerName.trim();
  if (!name) return offerQrPrintTexts.printPartnerFallback;
  return tpl(offerQrPrintTexts.printPartnerCollaboration, name);
}
