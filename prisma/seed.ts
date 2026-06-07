import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.visitEvent.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.specialDay.deleteMany();
  await prisma.workScheduleDay.deleteMany();
  await prisma.mediaAsset.deleteMany();

  const landingData = {
    heroTitle: "🎁 Ваш подарок — при покупке от 1500 ₽ на точке",
    heroSubtitle:
      "Приходите в EcoNext — выберите подарок: салфетка для оптики или сетка для посуды без моющих. Подключитесь к программе лояльности — дома заказывайте со скидками через приложение, Telegram или MAX.",
    heroDescription:
      "Полотенца, коврики и салфетки из микрофибры. Подарок на выбор — при визите на точку от 1500 ₽.",
    partnerLineTemplate: "Для вас от [partner_name]",
    addressBlockTitle: "📍 Где мы находимся",
    addressLabel: "Адрес",
    landmarkLabel: "Ориентир",
    schemeBlockTitle: "Схема прохода",
    schemeDefaultCaption: "Схема прохода к торговой точке EcoNext",
    storeMediaBlockTitle: "📸 Фото и видео точки",
    discountBlockTitle: "Как забрать подарок на точке",
    discountBlockDescription:
      "Подарок выдаётся только при визите в EcoNext — при покупке от 1500 ₽. На выбор: салфетка для оптики (очки, планшет, экраны, ювелирка) или узелковая сетка для посуды без моющих. Подключитесь к программе лояльности — дома заказывайте со скидками через приложение, Telegram или MAX.",
    discountHint:
      "Подарок — только на точке. Скидки при заказе домой — в приложении, Telegram или MAX.",
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
      "Подключитесь к программе лояльности заранее и приходите в следующий рабочий день — подарок при покупке от 1500 ₽.",
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
    discountButtonText: "🎁 Забрать подарок",
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

  const qrData = {
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

  await prisma.qrCardSettings.upsert({
    where: { id: 1 },
    update: qrData,
    create: { id: 1, ...qrData },
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
