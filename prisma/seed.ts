import { PrismaClient } from "@prisma/client";
import { mapStoreDefaults } from "../src/lib/map-defaults";

const prisma = new PrismaClient();

async function main() {
  await prisma.visitEvent.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.specialDay.deleteMany();
  await prisma.workScheduleDay.deleteMany();
  await prisma.mediaAsset.deleteMany();

  const landingData = {
    heroTitle: "Полезные вещи после моря и для дома",
    heroSubtitle:
      "Полотенца, тюрбаны для волос, мочалки, коврики, автонаборы, подарочные наборы и изделия из микрофибры EcoNext.",
    heroDescription: "Бонусы и акции EcoNext рядом с вами",
    partnerLineTemplate: "🎁 Подарок для гостей [partner_name]",
    addressBlockTitle: "📍 Где мы находимся",
    addressLabel: "Адрес",
    landmarkLabel: "Ориентир",
    schemeBlockTitle: "Схема прохода",
    schemeDefaultCaption: "Схема прохода к торговой точке EcoNext",
    storeMediaBlockTitle: "Так выглядит точка EcoNext",
    discountBlockTitle: "Как получить подарок за 3 шага",
    discountBlockDescription:
      "Подарок выдаётся на точке EcoNext при покупке от 1500 ₽.",
    discountHint:
      "Подарок — только на точке. Заказывать домой со скидкой можно потом через MAX, Telegram или UDS.",
    routeBlockTitle: "📍 Как к нам добраться",
    routeBlockDescription:
      "Ориентир: через дорогу от Магнита, по дороге к колесу обозрения.",
    scheduleBlockTitle: "📅 График работы EcoNext",
    scheduleSpecialDayPrefix: "Важно на сегодня:",
    openStatusTitle: "🟢 Сегодня открыты",
    breakStatusTitle: "🟡 Сейчас перерыв",
    beforeOpenStatusTitle: "🟡 Скоро откроемся",
    closedStatusTitle: "🔴 Сейчас закрыто",
    openStatusText: "Работаем: [today_schedule]",
    breakStatusText: "Вернёмся в [next_open_time]",
    beforeOpenStatusText: "Откроемся в [next_open_time]",
    closedStatusText: "Приходите в следующий рабочий день",
    callPromptText:
      "По любым вопросам звоните — мы на связи и с радостью подскажем.",
    callButtonText: "📞 Позвонить",
    privacyFooterText:
      "Мы учитываем обезличенную статистику посещений для улучшения сервиса.",
    notFoundTitle: "Партнёр не найден",
    notFoundDescription: "Проверьте QR-код или откройте главную страницу EcoNext.",
  };

  await prisma.landingSettings.upsert({
    where: { id: 1 },
    update: landingData,
    create: { id: 1, ...landingData },
  });

  const buttonData = {
    backButtonText: "← Назад",
    discountButtonText: "🎁 Получить подарок и маршрут",
    catalogButtonText: "🛍 Посмотреть ассортимент",
    routeButtonText: "📍 Как к нам добраться",
    scheduleButtonText: "📅 График работы",
    udsButtonText: "📱 Подключиться в приложении",
    telegramButtonText: "💬 Подключиться в Telegram",
    maxButtonText: "💬 Подключиться в MAX",
    catalogTelegramButtonText: "💬 Смотреть в Telegram",
    catalogMaxButtonText: "💬 Смотреть в MAX",
    catalogUdsButtonText: "📱 Открыть UDS",
    catalogUdsAppButtonText: "📲 Скачать приложение UDS",
    yandexMapsButtonText: "🟡 Яндекс Карты",
    yandexNavigatorButtonText: "🧭 Яндекс Навигатор",
    twoGisButtonText: "🟢 2ГИС",
    googleMapsButtonText: "🌍 Google Maps",
  };

  await prisma.buttonSettings.upsert({
    where: { id: 1 },
    update: buttonData,
    create: { id: 1, ...buttonData },
  });

  await prisma.mapSettings.upsert({
    where: { id: 1 },
    update: mapStoreDefaults,
    create: {
      id: 1,
      ...mapStoreDefaults,
      mapSchemeIsActive: true,
      mapSchemeImageUrl: null,
    },
  });

  await prisma.catalogSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: "Что есть в EcoNext",
      description:
        "Ассортимент можно посмотреть в MAX, Telegram, UDS или на сайте.",
      telegramCatalogText: "Откройте Telegram-бот и посмотрите ассортимент.",
      maxCatalogText: "Откройте MAX-бот и посмотрите ассортимент.",
      udsCatalogText:
        "В UDS нажмите кнопку «Открыть» — там доступен весь ассортимент.",
      udsAppText:
        "Скачайте приложение UDS, найдите EcoNext и смотрите товары там.",
      isActive: true,
    },
  });

  const qrData = {
    title: "🎁 Полезный подарок рядом с вами",
    description:
      "Сканируйте QR — узнайте, где мы, и заберите подарок на точке EcoNext.",
    benefitsText:
      "Полотенца, тюрбаны, мочалки, коврики, автонаборы и подарочные наборы из микрофибры.",
    footerText: "EcoNext · полезные изделия на море и для дома",
    giftText:
      "🎁 На выбор: салфетка для оптики или сетка для посуды без моющих",
    printA4Title: "🎁 Полезный подарок рядом с вами",
    printA6Title: "🎁 Полезный подарок рядом с вами",
    printFooterHint: "EcoNext · полезные изделия на море и для дома",
  };

  await prisma.qrCardSettings.upsert({
    where: { id: 1 },
    update: qrData,
    create: { id: 1, ...qrData },
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, publicSiteUrl: null },
  });

  await prisma.contactSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      telegramChannelButtonText: "Telegram-канал",
      maxChannelButtonText: "MAX-канал",
      whatsappButtonText: "WhatsApp",
      websiteButtonText: "Сайт EcoNext",
    },
  });

  const schedule = [
    { dayOfWeek: 1, openTime1: "15:30", closeTime1: "20:00", note: "работаем вечером" },
    {
      dayOfWeek: 2,
      openTime1: "10:00",
      closeTime1: "14:00",
      openTime2: "15:00",
      closeTime2: "20:00",
      note: "перерыв 14:00–15:00",
    },
    {
      dayOfWeek: 3,
      openTime1: "10:00",
      closeTime1: "14:00",
      openTime2: "15:00",
      closeTime2: "20:00",
      note: "перерыв 14:00–15:00",
    },
    {
      dayOfWeek: 4,
      openTime1: "10:00",
      closeTime1: "14:00",
      openTime2: "15:00",
      closeTime2: "20:00",
      note: "перерыв 14:00–15:00",
    },
    { dayOfWeek: 5, openTime1: "15:30", closeTime1: "20:00", note: "работаем вечером" },
    { dayOfWeek: 6, openTime1: "15:30", closeTime1: "20:00", note: "работаем вечером" },
    {
      dayOfWeek: 7,
      openTime1: "10:00",
      closeTime1: "14:00",
      openTime2: "15:00",
      closeTime2: "20:00",
      note: "перерыв 14:00–15:00",
    },
  ];

  for (const s of schedule) {
    await prisma.workScheduleDay.upsert({
      where: { dayOfWeek: s.dayOfWeek },
      update: s,
      create: { isWorking: true, ...s },
    });
  }

  await prisma.partner.create({
    data: {
      name: "Гостиница Морская",
      slug: "morskaya",
      partnerType: "hotel",
      telegramBotLink: "https://t.me/AssistentEcoNext_bot?start=hotel_morskaya",
      isActive: true,
    },
  });

  console.log("Seed completed");
}

main()
  .finally(() => prisma.$disconnect());
