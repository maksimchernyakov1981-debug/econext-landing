import type { CatalogSettings, ContactSettings } from "@prisma/client";

function pick(catalogVal?: string | null, contactVal?: string | null): string | null {
  const c = catalogVal?.trim();
  if (c) return c;
  const g = contactVal?.trim();
  return g || null;
}

/** Ссылки ассортимента: свои из раздела «Ассортимент» или общие из «Контакты». */
export function resolveCatalogLinks(catalog: CatalogSettings, contacts: ContactSettings) {
  return {
    telegram: pick(catalog.telegramCatalogUrl, contacts.telegramBotUrl),
    max: pick(catalog.maxCatalogUrl, contacts.maxBotUrl),
    uds: pick(catalog.udsCatalogUrl, contacts.udsUrl),
    website: contacts.websiteUrl?.trim() || null,
    udsApp: pick(catalog.udsAppDownloadUrl, contacts.udsAppDownloadUrl),
  };
}
