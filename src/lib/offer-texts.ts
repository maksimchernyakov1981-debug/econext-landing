/** Ссылка VK-бота EcoNext (общая для лендинга). */
export const DEFAULT_VK_BOT_URL = "https://vk.me/club57407045";

export const offerLandingTexts = {
  heroTitle: "Полезные вещи после моря и для дома",
  heroSubtitle:
    "Полотенца, тюрбаны для волос, мочалки, коврики, автонаборы, подарочные наборы и изделия из микрофибры EcoNext.",
  heroDescription: "Бонусы и акции EcoNext рядом с вами",
  partnerLineTemplate: "🎁 Подарок для гостей [partner_name]",
  discountBlockTitle: "Как получить подарок за 3 шага",
  discountBlockDescription:
    "Подарок выдаётся на точке EcoNext при покупке от 1500 ₽.",
  discountHint:
    "Подарок — только на точке. Заказывать домой со скидкой можно потом через MAX, Telegram, VK или наше приложение.",
  addressBlockTitle: "📍 Где мы находимся",
  storeMediaBlockTitle: "Так выглядит точка EcoNext",
  routeBlockTitle: "📍 Как к нам добраться",
  routeBlockDescription:
    "Ориентир: через дорогу от Магнита, по дороге к колесу обозрения.",
  openStatusTitle: "🟢 Сегодня открыты",
  breakStatusTitle: "🟡 Сейчас перерыв",
  beforeOpenStatusTitle: "🟡 Скоро откроемся",
  closedStatusTitle: "🔴 Сейчас закрыто",
  openStatusText: "Работаем: [today_schedule]",
  breakStatusText: "Вернёмся в [next_open_time]",
  beforeOpenStatusText: "Откроемся в [next_open_time]",
  closedStatusText: "Приходите в следующий рабочий день",
};

export const offerButtonTexts = {
  discountButtonText: "🎁 Получить подарок и маршрут",
  udsButtonText: "📱 Подключиться в приложении",
  telegramButtonText: "💬 Подключиться в Telegram",
  maxButtonText: "💬 Подключиться в MAX",
  vkButtonText: "Подключиться в VK",
  catalogTelegramButtonText: "💬 Подобрать товар в Telegram",
  catalogMaxButtonText: "💬 Подобрать товар в MAX",
  catalogVkButtonText: "Подобрать товар в VK",
  catalogUdsButtonText: "📱 Открыть наше приложение",
  catalogUdsAppButtonText: "📲 Скачать наше приложение",
};

export const offerCatalogTexts = {
  title: "Что есть в EcoNext",
  description:
    "Ассортимент можно посмотреть в MAX, Telegram, VK, нашем приложении или на сайте.",
  telegramCatalogText: "Подобрать товар в Telegram",
  maxCatalogText: "Подобрать товар в боте MAX",
  udsCatalogText:
    "В нашем приложении нажмите «Открыть» — там доступен весь ассортимент EcoNext.",
  udsAppText:
    "Скачайте наше приложение, найдите EcoNext и смотрите товары там.",
  vkCatalogText: "Подобрать товар в VK",
};

/** Подсказка под CTA на hero и внизу страницы */
export const heroLocationHint =
  "Через дорогу от Магнита, по дороге к колесу обозрения · ул. Калараша, 43";

/** Версия текстов — при смене на Vercel автоматически обновляется Blob. */
export const OFFER_TEXTS_VERSION = 14;

const GUEST_TEXT_PATTERN = /гост/i;

function clearIfGuestText(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  return GUEST_TEXT_PATTERN.test(value) ? null : value;
}

/** Убрать устаревшие override партнёра с формулировками «гости отеля». */
export function sanitizePartnerOfferOverrides<
  T extends {
    customHeroTitle?: string | null;
    customHeroSubtitle?: string | null;
    customHeroDescription?: string | null;
    customGiftText?: string | null;
    customQrText?: string | null;
  },
>(partners: T[]): T[] {
  return partners.map((p) => ({
    ...p,
    customHeroTitle: clearIfGuestText(p.customHeroTitle),
    customHeroSubtitle: clearIfGuestText(p.customHeroSubtitle),
    customHeroDescription: clearIfGuestText(p.customHeroDescription),
    customGiftText: clearIfGuestText(p.customGiftText),
    customQrText: clearIfGuestText(p.customQrText),
  }));
}

/** Только поля модели QrCardSettings (для Prisma / Blob). */
export const offerQrDbTexts = {
  title: "🎁 Полезный подарок рядом с вами",
  description:
    "Сканируйте QR — узнайте, где мы, и заберите подарок на точке EcoNext.",
  benefitsText:
    "Полотенца, тюрбаны, мочалки, коврики, автонаборы и подарочные наборы из микрофибры.",
  footerText: "EcoNext · полезные изделия на море и для дома",
  giftText: "🎁 Подарок при покупке от 1500 ₽ на точке EcoNext",
  printA4Title: "🎁 Полезный подарок рядом с вами",
  printA6Title: "🎁 Полезный подарок рядом с вами",
  printFooterHint: "EcoNext · полезные изделия на море и для дома",
};

/** Тексты печати листовок — только в коде, не в БД. */
export const offerQrPrintTexts = {
  printBrandLabel: "🏖 ECONEXT",
  printPartnerCollaboration: "EcoNext 🤝 [partner_name]",
  printPartnerFallback: "EcoNext · Лазаревское",
  printHeadlineLine1: "НЕ ЗНАЕТЕ,",
  printHeadlineLine2: "ЧТО ПРИВЕЗТИ С МОРЯ?",
  printSubheadline: "Хотите не банальный подарок для близких?",
  printGiftCategories: [
    "👩 Маме",
    "👵 Бабушке",
    "👨 Папе",
    "👦 Сыну",
    "👨 Брату",
    "🎁 Друзьям и родным",
  ],
  printProductsIntro: "Тогда обратите внимание на:",
  printProductHighlights: ["😺 Кошачий язык", "💜 Афродита", "🧚 Фея"],
  printSeaTitleLine1: "ИЛИ ЧТО ВЗЯТЬ НА МОРЕ",
  printSeaTitleLine2: "УЖЕ СЕГОДНЯ?",
  printSeaProducts: ["🏖 Макси", "✨ Роскошь", "🎵 Муза", "🌿 Чистотел"],
  printWhatIsIt: "❓ ЧТО ЭТО ТАКОЕ?",
  printStoreInvite: "Заходите, расскажу и покажу 🙂",
  printScanLabelLine1: "📱 СКАНИРУЙТЕ QR",
  printScanLabelLine2: "И УЗНАЙТЕ ЗА 30 СЕКУНД: МАРШРУТ И АССОРТИМЕНТ",
  printVisitIntro: "или приходите сразу:",
  printAddressLine: "📍 ул. Калараша, 43",
  printPhoneLine: "📞 +7 (921) 252-32-95",
  printFooterBrand: "EcoNext",
  printFooterLine: "EcoNext · полезные изделия на море и для дома",
};

export const offerQrTexts = { ...offerQrDbTexts, ...offerQrPrintTexts };

export function isOfferTextsCurrent(snapshot: {
  landing: { discountBlockTitle?: string };
  buttons: { discountButtonText?: string; vkButtonText?: string | null };
  offerTextsVersion?: number;
  contacts?: { vkBotUrl?: string | null };
}): boolean {
  return (
    snapshot.offerTextsVersion === OFFER_TEXTS_VERSION &&
    snapshot.landing.discountBlockTitle === offerLandingTexts.discountBlockTitle &&
    snapshot.buttons.discountButtonText === offerButtonTexts.discountButtonText &&
    Boolean(snapshot.buttons.vkButtonText?.trim()) &&
    Boolean(snapshot.contacts?.vkBotUrl?.trim())
  );
}

export function mergeOfferTextsIntoSnapshot<
  T extends {
    landing: Record<string, unknown>;
    buttons: Record<string, unknown>;
    qr: Record<string, unknown>;
    catalog?: Record<string, unknown>;
    contacts?: Record<string, unknown> & { vkBotUrl?: string | null };
    partners?: Array<{
      customHeroTitle?: string | null;
      customHeroSubtitle?: string | null;
      customHeroDescription?: string | null;
      customGiftText?: string | null;
      customQrText?: string | null;
    }>;
    offerTextsVersion?: number;
  },
>(current: T): T {
  const contacts = current.contacts
    ? {
        ...current.contacts,
        vkBotUrl:
          (typeof current.contacts.vkBotUrl === "string" &&
            current.contacts.vkBotUrl.trim()) ||
          DEFAULT_VK_BOT_URL,
      }
    : current.contacts;

  return {
    ...current,
    offerTextsVersion: OFFER_TEXTS_VERSION,
    landing: { ...current.landing, ...offerLandingTexts },
    buttons: { ...current.buttons, ...offerButtonTexts },
    qr: { ...current.qr, ...offerQrDbTexts },
    catalog: current.catalog
      ? { ...current.catalog, ...offerCatalogTexts }
      : current.catalog,
    contacts,
    partners: sanitizePartnerOfferOverrides(current.partners ?? []),
  };
}
