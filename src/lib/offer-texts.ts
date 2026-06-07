export const offerLandingTexts = {
  heroTitle: "🎁 Ваш подарок — при покупке от 1500 ₽ на точке",
  heroSubtitle:
    "Салфетка для оптики или сетка для посуды без моющих — на выбор при визите в EcoNext.",
  heroDescription:
    "Полотенца, коврики и салфетки из микрофибры.",
  partnerLineTemplate: "Подарок для вас от [partner_name]",
  discountBlockTitle: "Как получить подарок за 3 шага",
  discountBlockDescription:
    "На выбор: салфетка для оптики (очки, планшет, экраны, ювелирка) или узелковая сетка для посуды без моющих. Подарок выдаётся только на точке — при покупке от 1500 ₽.",
  discountHint:
    "Подарок — только на точке. Дома заказывайте со скидкой — в том же боте или приложении.",
  closedStatusText:
    "Подключитесь к программе лояльности заранее и приходите в следующий рабочий день — подарок при покупке от 1500 ₽.",
};

export const offerButtonTexts = {
  discountButtonText: "🎁 Получить подарок",
  udsButtonText: "📱 Подключиться в приложении",
  telegramButtonText: "💬 Подключиться в Telegram",
  maxButtonText: "💬 Подключиться в MAX",
};

/** Версия текстов — при смене на Vercel автоматически обновляется Blob. */
export const OFFER_TEXTS_VERSION = 2;

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
  title: "🎁 Подарок от 1500 ₽ на точке EcoNext",
  description:
    "Сканируйте QR:\n• подарок на точке при покупке от 1500 ₽;\n• салфетка для оптики или сетка для посуды — на выбор;\n• подключитесь к программе — скидки дома в приложении, Telegram или MAX;\n• график, маршрут, ассортимент.",
  benefitsText:
    "Подарок при визите от 1500 ₽.\nСкидки дома через бота или приложение.\nБыстро сохнут. Мало места в чемодане.",
  footerText:
    "Полотенца, коврики и салфетки из микрофибры. Подарок — на точке, скидки — дома.",
  giftText:
    "Подарок на выбор при покупке от 1500 ₽ на точке: салфетка для оптики или сетка для посуды без моющих.",
  printA4Title: "🎁 Ваш подарок — при покупке от 1500 ₽",
  printA6Title: "🎁 Подарок EcoNext",
  printFooterHint: "EcoNext · полотенца и салфетки из микрофибры",
};

/** Тексты печати листовок — только в коде, не в БД. */
export const offerQrPrintTexts = {
  printPartnerLine: "Подарок для вас от [partner_name]",
  printLead:
    "Сканируйте QR — подключитесь в MAX, Telegram или приложении и заберите подарок на точке EcoNext.",
  printSteps: [
    "Сканируйте QR-код",
    "Подключитесь в MAX, Telegram или приложении",
    "Приходите в EcoNext — покупка от 1500 ₽, выберите подарок",
  ],
  printGiftLine:
    "На выбор: салфетка для оптики или узелковая сетка для посуды без моющих.",
  printBonusLine: "Дома заказывайте со скидками — в приложении, Telegram или MAX.",
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
    partners: sanitizePartnerOfferOverrides(current.partners ?? []),
  };
}
