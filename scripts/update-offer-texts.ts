/**
 * Одноразовое обновление текстов оффера в SQLite + Blob (если подключён).
 * Запуск: npx tsx scripts/update-offer-texts.ts
 */
import { PrismaClient } from "@prisma/client";
import { existsSync } from "fs";
import path from "path";

async function loadEnvFile(): Promise<void> {
  const text = await import("fs/promises")
    .then((fs) => fs.readFile(path.join(process.cwd(), ".env"), "utf8"))
    .catch(() => "");
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

function resolveDbUrl(): string {
  const fromEnv = process.env.DATABASE_URL?.trim();
  if (fromEnv?.startsWith("file:")) return fromEnv;

  // Пути относительно prisma/schema.prisma
  const prod = path.join(process.cwd(), "prisma", "prod.db");
  const dev = path.join(process.cwd(), "prisma", "dev.db");
  if (existsSync(prod)) return "file:./prod.db";
  if (existsSync(dev)) return "file:./dev.db";
  return "file:./dev.db";
}

const landingUpdate = {
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

const buttonsUpdate = {
  discountButtonText: "🎁 Забрать подарок",
  udsButtonText: "📱 Подключиться в приложении",
  telegramButtonText: "💬 Подключиться в Telegram",
  maxButtonText: "💬 Подключиться в MAX",
};

const qrUpdate = {
  title: "🎁 Подарок от 1500 ₽ на точке EcoNext",
  description:
    "Сканируйте QR:\n• подарок на точке при покупке от 1500 ₽;\n• салфетка для оптики или сетка для посуды — на выбор;\n• подключитесь к программе — скидки дома в приложении, Telegram или MAX;\n• график, маршрут, ассортимент.",
  benefitsText:
    "Подарок при визите от 1500 ₽.\nСкидки дома через бота или приложение.\nБыстро сохнут. Мало места в чемодане.",
  footerText:
    "Полотенца, коврики и салфетки из микрофибры. Подарок — на точке, скидки — дома.",
  giftText:
    "Подарок на выбор при покупке от 1500 ₽ на точке: салфетка для оптики или сетка для посуды без моющих.",
  printA4Title: "🎁 Подарок от 1500 ₽ — [partner_name]",
  printA6Title: "🎁 EcoNext — [partner_name]",
  printFooterHint: "Отсканируйте QR — подарок на точке, скидки дома.",
};

async function main() {
  await loadEnvFile();
  process.env.DATABASE_URL = resolveDbUrl();

  const prisma = new PrismaClient();
  console.log("DATABASE_URL:", process.env.DATABASE_URL);

  const before = await prisma.landingSettings.findFirst({ where: { id: 1 } });
  if (!before) {
    console.error("LandingSettings id=1 не найден. Сначала: npx prisma db push && npx prisma db seed");
    process.exit(1);
  }

  console.log("Было heroTitle:", before.heroTitle);

  await prisma.landingSettings.update({ where: { id: 1 }, data: landingUpdate });
  await prisma.buttonSettings.update({ where: { id: 1 }, data: buttonsUpdate });
  await prisma.qrCardSettings.update({ where: { id: 1 }, data: qrUpdate });

  const after = await prisma.landingSettings.findFirst({ where: { id: 1 } });
  console.log("Стало heroTitle:", after?.heroTitle);

  await prisma.$disconnect();

  // Blob snapshot для Vercel (если токен в .env)
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
      process.env.DATABASE_URL = resolveDbUrl();
      const { captureSettingsSnapshot, persistSettingsSnapshot } = await import(
        "../src/lib/settings-backup"
      );
      const snap = await captureSettingsSnapshot();
      const result = await persistSettingsSnapshot(snap);
      console.log("Blob:", result.ok ? "обновлён" : result.message);
    } else {
      console.log("Blob: токен не найден — только локальная БД");
    }
  } catch (e) {
    console.warn("Blob sync skipped:", e instanceof Error ? e.message : e);
  }

  console.log("Готово.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
