/**
 * Одноразовое обновление текстов оффера в SQLite + Blob (если подключён).
 * Запуск: npx tsx scripts/update-offer-texts.ts
 */
import { PrismaClient } from "@prisma/client";
import { existsSync } from "fs";
import path from "path";
import {
  offerButtonTexts,
  offerLandingTexts,
  offerQrTexts,
} from "../src/lib/offer-texts";

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

  await prisma.landingSettings.update({ where: { id: 1 }, data: offerLandingTexts });
  await prisma.buttonSettings.update({ where: { id: 1 }, data: offerButtonTexts });
  await prisma.qrCardSettings.update({ where: { id: 1 }, data: offerQrTexts });

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
