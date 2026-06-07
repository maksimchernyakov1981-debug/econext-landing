export const offerLandingTexts = {
  heroTitle: "🎁 Ваш подарок — при покупке от 1500 ₽ на точке",
  heroSubtitle:
    "Приходите в EcoNext — выберите подарок: салфетка для оптики или сетка для посуды без моющих. Подключитесь к программе лояльности — дома заказывайте со скидками через приложение, Telegram или MAX.",
  heroDescription:
    "Полотенца, коврики и салфетки из микрофибры. Подарок на выбор — при визите на точку от 1500 ₽.",
  partnerLineTemplate: "Для вас от [partner_name]",
  discountBlockTitle: "Как забрать подарок на точке",
  discountBlockDescription:
    "Подарок выдаётся только при визите в EcoNext — при покупке от 1500 ₽. На выбор: салфетка для оптики (очки, планшет, экраны, ювелирка) или узелковая сетка для посуды без моющих. Подключитесь к программе лояльности — дома заказывайте со скидками через приложение, Telegram или MAX.",
  discountHint:
    "Подарок — только на точке. Скидки при заказе домой — в приложении, Telegram или MAX.",
  closedStatusText:
    "Подключитесь к программе лояльности заранее и приходите в следующий рабочий день — подарок при покупке от 1500 ₽.",
};

export const offerButtonTexts = {
  discountButtonText: "🎁 Забрать подарок",
  udsButtonText: "📱 Подключиться в приложении",
  telegramButtonText: "💬 Подключиться в Telegram",
  maxButtonText: "💬 Подключиться в MAX",
};

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

export const offerQrTexts = {
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
  printPartnerLine: "Для вас от [partner_name]",
  printLead:
    "Сканируйте QR — подключитесь к программе лояльности и заберите подарок на точке EcoNext.",
  printSteps: [
    "Сканируйте QR-код",
    "Подключитесь в MAX, Telegram или приложении",
    "Приходите в EcoNext — покупка от 1500 ₽, выберите подарок",
  ],
  printGiftLine:
    "На выбор: салфетка для оптики или узелковая сетка для посуды без моющих.",
  printBonusLine: "Дома заказывайте со скидками — в приложении, Telegram или MAX.",
  printFooterHint: "EcoNext · полотенца и салфетки из микрофибры",
};
