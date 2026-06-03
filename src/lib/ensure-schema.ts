import { prisma } from "./prisma";

/** Колонки, добавленные после первого деплоя — старый SQLite из Blob их не содержит. */
const SQLITE_MIGRATIONS: { table: string; column: string; ddl: string }[] = [
  {
    table: "MapSettings",
    column: "mapDisplayMode",
    ddl: `ALTER TABLE "MapSettings" ADD COLUMN "mapDisplayMode" TEXT NOT NULL DEFAULT 'auto'`,
  },
  {
    table: "LandingSettings",
    column: "callPromptText",
    ddl: `ALTER TABLE "LandingSettings" ADD COLUMN "callPromptText" TEXT`,
  },
  {
    table: "LandingSettings",
    column: "callButtonText",
    ddl: `ALTER TABLE "LandingSettings" ADD COLUMN "callButtonText" TEXT`,
  },
  {
    table: "QrCardSettings",
    column: "printA4Title",
    ddl: `ALTER TABLE "QrCardSettings" ADD COLUMN "printA4Title" TEXT`,
  },
  {
    table: "QrCardSettings",
    column: "printA6Title",
    ddl: `ALTER TABLE "QrCardSettings" ADD COLUMN "printA6Title" TEXT`,
  },
  {
    table: "QrCardSettings",
    column: "printFooterHint",
    ddl: `ALTER TABLE "QrCardSettings" ADD COLUMN "printFooterHint" TEXT`,
  },
];

let schemaReady = false;

async function tableHasColumn(table: string, column: string): Promise<boolean> {
  const rows = await prisma.$queryRawUnsafe<{ name: string }[]>(
    `PRAGMA table_info("${table}")`
  );
  return rows.some((r) => r.name === column);
}

/** Добавить недостающие колонки в SQLite (старый файл из Blob после Redeploy). */
export async function ensureSqliteSchemaMigrations(): Promise<void> {
  if (schemaReady) return;

  for (const { table, column, ddl } of SQLITE_MIGRATIONS) {
    try {
      const exists = await tableHasColumn(table, column);
      if (!exists) {
        await prisma.$executeRawUnsafe(ddl);
        console.info("[ensure-schema] added", table, column);
      }
    } catch (e) {
      console.error("[ensure-schema]", table, column, e);
    }
  }

  schemaReady = true;
}
