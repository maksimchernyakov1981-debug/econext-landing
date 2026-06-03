import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.visitEvent.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.specialDay.deleteMany();
  await prisma.workScheduleDay.deleteMany();
  await prisma.mediaAsset.deleteMany();

  await prisma.landingSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroTitle: "🎁 Подарок гостям отеля",
      heroSubtitle:
        "Получите скидку или бонусы EcoNext и посмотрите, как к нам добраться.",
      heroDescription:
        "Полотенца, коврики и салфетки из микрофибры для моря, дома и подарков.",
      partnerLineTemplate: "Специально для гостей: [partner_name]",
      addressBlockTitle: "📍 Где мы находимся",
      addressLabel: "Адрес",
      landmarkLabel: "Ориентир",
      schemeBlockTitle: "Схема прохода",
      schemeDefaultCaption: "Схема прохода к торговой точке EcoNext",
      discountBlockTitle: "🎁 Выберите удобный способ",
      discountBlockDescription:
        "Скидку и бонусы можно получить через UDS. Также можно открыть помощника EcoNext в Telegram или MAX.",
      discountHint: "После открытия покажите код продавцу на точке EcoNext.",
      routeBlockTitle: "📍 Как нас найти",
      routeBlockDescription: "Выберите удобную карту.",
      scheduleBlockTitle: "📅 График работы EcoNext",
      scheduleSpecialDayPrefix: "Важно на сегодня:",
      openStatusTitle: "✅ Сегодня работаем",
      breakStatusTitle: "⏸ Сейчас перерыв",
      beforeOpenStatusTitle: "⏳ Сегодня откроемся в [next_open_time]",
      closedStatusTitle: "⛔ Сегодня уже закрыто",
      openStatusText: "[today_schedule]",
      breakStatusText:
        "Откроемся сегодня в [next_open_time]. Работаем до [close_time].",
      beforeOpenStatusText: "Работаем до [close_time].",
      closedStatusText:
        "Получите скидку / бонусы заранее и приходите в следующий рабочий день.",
      callPromptText:
        "По любым вопросам звоните — мы на связи и с радостью подскажем.",
      callButtonText: "📞 Позвонить",
      privacyFooterText:
        "Мы учитываем обезличенную статистику посещений для улучшения сервиса.",
      notFoundTitle: "Партнёр не найден",
      notFoundDescription: "Проверьте QR-код или откройте главную страницу EcoNext.",
    },
  });

  await prisma.buttonSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      backButtonText: "← Назад",
      discountButtonText: "🎁 Получить скидку / бонусы",
      catalogButtonText: "🛍 Посмотреть ассортимент",
      routeButtonText: "📍 Как к нам добраться",
      scheduleButtonText: "📅 График работы",
      udsButtonText: "📱 Открыть приложение UDS",
      telegramButtonText: "💬 Получить в Telegram",
      maxButtonText: "💬 Получить в MAX",
      catalogTelegramButtonText: "💬 Смотреть в Telegram",
      catalogMaxButtonText: "💬 Смотреть в MAX",
      catalogUdsButtonText: "📱 Открыть UDS",
      catalogUdsAppButtonText: "📲 Скачать приложение UDS",
      yandexMapsButtonText: "🟡 Яндекс Карты",
      yandexNavigatorButtonText: "🧭 Яндекс Навигатор",
      twoGisButtonText: "🟢 2ГИС",
      googleMapsButtonText: "🌍 Google Maps",
    },
  });

  await prisma.mapSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      storeName: "EcoNext",
      address: "г. Анапа, ул. Примерная, павильон EcoNext",
      landmark: "рядом с центральным рынком, вход со стороны набережной",
      mapSchemeCaption: "Схема прохода к торговой точке EcoNext",
      mapSchemeIsActive: true,
    },
  });

  await prisma.catalogSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: "🛍 Посмотреть ассортимент",
      description:
        "Весь ассортимент EcoNext можно посмотреть в Telegram, MAX или UDS.",
      telegramCatalogText: "Откройте Telegram-бот и посмотрите ассортимент.",
      maxCatalogText: "Откройте MAX-бот и посмотрите ассортимент.",
      udsCatalogText:
        "В UDS нажмите кнопку «Открыть» — там доступен весь ассортимент.",
      udsAppText:
        "Скачайте приложение UDS, найдите EcoNext и смотрите товары там.",
      isActive: true,
    },
  });

  await prisma.qrCardSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: "🎁 Подарок гостям отеля",
      description:
        "Сканируйте QR:\n• получите скидку / бонусы EcoNext;\n• посмотрите актуальный график;\n• постройте маршрут до точки;\n• откройте ассортимент в Telegram, MAX или UDS.",
      benefitsText:
        "Быстро сохнут.\nМало места в чемодане.\nДома пригодятся каждый день.",
      footerText:
        "Полотенца, коврики и салфетки из микрофибры для моря, дома и подарков.",
      printA4Title: "🎁 Подарок гостям: [partner_name]",
      printA6Title: "🎁 EcoNext — [partner_name]",
      printFooterHint:
        "Отсканируйте QR — скидка, график, маршрут и ассортимент.",
    },
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
