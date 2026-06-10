export const offerLandingTexts = {
  heroTitle: "Полезные вещи после моря и для дома",
  heroSubtitle:
    "Полотенца, тюрбаны для волос, мочалки, коврики, автонаборы, подарочные наборы и изделия из микрофибры EcoNext.",
  heroDescription: "Подарок при покупке от 1500 ₽ на точке",
  partnerLineTemplate: "🎁 Подарок для гостей [partner_name]",
  discountBlockTitle: "Как получить подарок за 3 шага",
  discountBlockDescription:
    "Подарок выдаётся на точке EcoNext при покупке от 1500 ₽.",
  discountHint:
    "Подарок — только на точке. Заказывать домой со скидкой можно потом через MAX, Telegram или UDS.",
  addressBlockTitle: "📍 Где мы находимся",
  storeMediaBlockTitle: "Так выглядит точка EcoNext",
  routeBlockTitle: "📍 Как к нам добраться",
  routeBlockDescription:
    "Мы рядом с гостиницей Оскар — около 1 минуты пешком.\nОриентир: через дорогу от Магнита и гостиницы Оскар.",
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
};

export const offerCatalogTexts = {
  title: "Что есть в EcoNext",
  description:
    "Ассортимент можно посмотреть в MAX, Telegram, UDS или на сайте.",
};

/** Подсказка под CTA на hero и внизу страницы */
export const heroLocationHint = "1 минута от гостиницы Оскар · ул. Калараша, 43";

/** Версия текстов — при смене на Vercel автоматически обновляется Blob. */
export const OFFER_TEXTS_VERSION = 9;

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
  giftText:
    "🎁 На выбор: салфетка для оптики или сетка для посуды без моющих",
  printA4Title: "🏖 НЕ ЗНАЕТЕ, ЧТО ПРИВЕЗТИ С МОРЯ?",
  printA6Title: "🏖 НЕ ЗНАЕТЕ, ЧТО ПРИВЕЗТИ С МОРЯ?",
  printFooterHint: "EcoNext · полезные изделия на море и для дома",
};

/** Тексты печати листовок — только в коде, не в БД. */
export const offerQrPrintTexts = {
  printBrandLabel: "🏖 ECONEXT",
  printPartnerCollaboration: "EcoNext × [partner_name]",
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
  printScanLabelLine1: "📱 СКАНИРУЙТЕ QR",
  printScanLabelLine2: "МАРШРУТ И АССОРТИМЕНТ",
  printVisitIntro: "или приходите сразу:",
  printAddressLine: "📍 ул. Калараша, 43",
  printPhoneLine: "📞 +7 (921) 252-32-95",
  printFooterBrand: "EcoNext",
  printFooterLine: "EcoNext · полезные изделия на море и для дома",
};

export const offerQrTexts = { ...offerQrDbTexts, ...offerQrPrintTexts };

export function isOfferTextsCurrent(snapshot: {
  landing: { discountBlockTitle?: string };
  buttons: { discountButtonText?: string };
  offerTextsVersion?: number;
}): boolean {
  return (
    snapshot.offerTextsVersion === OFFER_TEXTS_VERSION &&
    snapshot.landing.discountBlockTitle === offerLandingTexts.discountBlockTitle &&
    snapshot.buttons.discountButtonText === offerButtonTexts.discountButtonText
  );
}

export function mergeOfferTextsIntoSnapshot<
  T extends {
    landing: Record<string, unknown>;
    buttons: Record<string, unknown>;
    qr: Record<string, unknown>;
    catalog?: Record<string, unknown>;
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
  return {
    ...current,
    offerTextsVersion: OFFER_TEXTS_VERSION,
    landing: { ...current.landing, ...offerLandingTexts },
    buttons: { ...current.buttons, ...offerButtonTexts },
    qr: { ...current.qr, ...offerQrDbTexts },
    catalog: current.catalog
      ? { ...current.catalog, ...offerCatalogTexts }
      : current.catalog,
    partners: sanitizePartnerOfferOverrides(current.partners ?? []),
  };
}
