import { prisma } from "./prisma";

/** Колонки, добавленные после первого деплоя — старый SQLite из Blob их не содержит. */
const SQLITE_MIGRATIONS: { table: string; column: string; ddls: string[] }[] = [
  {
    table: "MapSettings",
    column: "mapDisplayMode",
    ddls: [
      `ALTER TABLE "MapSettings" ADD COLUMN "mapDisplayMode" TEXT DEFAULT 'auto'`,
      `ALTER TABLE MapSettings ADD COLUMN mapDisplayMode TEXT DEFAULT 'auto'`,
    ],
  },
  {
    table: "LandingSettings",
    column: "callPromptText",
    ddls: [
      `ALTER TABLE "LandingSettings" ADD COLUMN "callPromptText" TEXT`,
      `ALTER TABLE LandingSettings ADD COLUMN callPromptText TEXT`,
    ],
  },
  {
    table: "LandingSettings",
    column: "callButtonText",
    ddls: [
      `ALTER TABLE "LandingSettings" ADD COLUMN "callButtonText" TEXT`,
      `ALTER TABLE LandingSettings ADD COLUMN callButtonText TEXT`,
    ],
  },
  {
    table: "QrCardSettings",
    column: "printA4Title",
    ddls: [
      `ALTER TABLE "QrCardSettings" ADD COLUMN "printA4Title" TEXT`,
      `ALTER TABLE QrCardSettings ADD COLUMN printA4Title TEXT`,
    ],
  },
  {
    table: "QrCardSettings",
    column: "printA6Title",
    ddls: [
      `ALTER TABLE "QrCardSettings" ADD COLUMN "printA6Title" TEXT`,
      `ALTER TABLE QrCardSettings ADD COLUMN printA6Title TEXT`,
    ],
  },
  {
    table: "QrCardSettings",
    column: "printFooterHint",
    ddls: [
      `ALTER TABLE "QrCardSettings" ADD COLUMN "printFooterHint" TEXT`,
      `ALTER TABLE QrCardSettings ADD COLUMN printFooterHint TEXT`,
    ],
  },
];

export async function tableHasColumn(table: string, column: string): Promise<boolean> {
  try {
    const rows = await prisma.$queryRawUnsafe<{ name: string }[]>(
      `PRAGMA table_info("${table}")`
    );
    if (rows.some((r) => r.name === column)) return true;
    const alt = await prisma.$queryRawUnsafe<{ name: string }[]>(
      `PRAGMA table_info(${table})`
    );
    return alt.some((r) => r.name === column);
  } catch {
    return false;
  }
}

async function addColumn(table: string, column: string, ddls: string[]): Promise<boolean> {
  if (await tableHasColumn(table, column)) return true;
  for (const ddl of ddls) {
    try {
      await prisma.$executeRawUnsafe(ddl);
      if (await tableHasColumn(table, column)) {
        console.info("[ensure-schema] added", table, column);
        return true;
      }
    } catch (e) {
      console.warn("[ensure-schema] ddl failed", ddl, e);
    }
  }
  return false;
}

/** Добавить недостающие колонки в SQLite (старый файл из Blob после Redeploy). */
export async function ensureSqliteSchemaMigrations(): Promise<void> {
  for (const { table, column, ddls } of SQLITE_MIGRATIONS) {
    await addColumn(table, column, ddls);
  }
}

/** Не передавать в Prisma поля, которых ещё нет в SQLite. */
export async function filterMapSettingsForSqlite<T extends Record<string, unknown>>(
  data: T
): Promise<T> {
  const has = await tableHasColumn("MapSettings", "mapDisplayMode");
  if (has || !("mapDisplayMode" in data)) return data;
  const { mapDisplayMode: _drop, ...rest } = data;
  return rest as T;
}
