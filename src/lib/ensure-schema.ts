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
  {
    table: "LandingSettings",
    column: "storeMediaBlockTitle",
    ddls: [
      `ALTER TABLE "LandingSettings" ADD COLUMN "storeMediaBlockTitle" TEXT DEFAULT '📸 Фото и видео точки'`,
      `ALTER TABLE LandingSettings ADD COLUMN storeMediaBlockTitle TEXT DEFAULT '📸 Фото и видео точки'`,
    ],
  },
  {
    table: "ContactSettings",
    column: "vkBotUrl",
    ddls: [
      `ALTER TABLE "ContactSettings" ADD COLUMN "vkBotUrl" TEXT`,
      `ALTER TABLE ContactSettings ADD COLUMN vkBotUrl TEXT`,
    ],
  },
  {
    table: "Partner",
    column: "vkBotLink",
    ddls: [
      `ALTER TABLE "Partner" ADD COLUMN "vkBotLink" TEXT`,
      `ALTER TABLE Partner ADD COLUMN vkBotLink TEXT`,
    ],
  },
  {
    table: "ButtonSettings",
    column: "vkButtonText",
    ddls: [
      `ALTER TABLE "ButtonSettings" ADD COLUMN "vkButtonText" TEXT NOT NULL DEFAULT 'Подключиться в VK'`,
      `ALTER TABLE ButtonSettings ADD COLUMN vkButtonText TEXT NOT NULL DEFAULT 'Подключиться в VK'`,
    ],
  },
  {
    table: "ButtonSettings",
    column: "catalogVkButtonText",
    ddls: [
      `ALTER TABLE "ButtonSettings" ADD COLUMN "catalogVkButtonText" TEXT NOT NULL DEFAULT 'Смотреть в VK'`,
      `ALTER TABLE ButtonSettings ADD COLUMN catalogVkButtonText TEXT NOT NULL DEFAULT 'Смотреть в VK'`,
    ],
  },
  {
    table: "CatalogSettings",
    column: "vkCatalogText",
    ddls: [
      `ALTER TABLE "CatalogSettings" ADD COLUMN "vkCatalogText" TEXT`,
      `ALTER TABLE CatalogSettings ADD COLUMN vkCatalogText TEXT`,
    ],
  },
  {
    table: "CatalogSettings",
    column: "vkCatalogUrl",
    ddls: [
      `ALTER TABLE "CatalogSettings" ADD COLUMN "vkCatalogUrl" TEXT`,
      `ALTER TABLE CatalogSettings ADD COLUMN vkCatalogUrl TEXT`,
    ],
  },
  {
    table: "CatalogSettings",
    column: "giftCategoryTitle",
    ddls: [
      `ALTER TABLE "CatalogSettings" ADD COLUMN "giftCategoryTitle" TEXT`,
      `ALTER TABLE CatalogSettings ADD COLUMN giftCategoryTitle TEXT`,
    ],
  },
  {
    table: "CatalogSettings",
    column: "giftCategoryDescription",
    ddls: [
      `ALTER TABLE "CatalogSettings" ADD COLUMN "giftCategoryDescription" TEXT`,
      `ALTER TABLE CatalogSettings ADD COLUMN giftCategoryDescription TEXT`,
    ],
  },
  {
    table: "CatalogSettings",
    column: "giftForHerTitle",
    ddls: [
      `ALTER TABLE "CatalogSettings" ADD COLUMN "giftForHerTitle" TEXT`,
      `ALTER TABLE CatalogSettings ADD COLUMN giftForHerTitle TEXT`,
    ],
  },
  {
    table: "CatalogSettings",
    column: "giftForHerItems",
    ddls: [
      `ALTER TABLE "CatalogSettings" ADD COLUMN "giftForHerItems" TEXT`,
      `ALTER TABLE CatalogSettings ADD COLUMN giftForHerItems TEXT`,
    ],
  },
  {
    table: "CatalogSettings",
    column: "giftHomeTitle",
    ddls: [
      `ALTER TABLE "CatalogSettings" ADD COLUMN "giftHomeTitle" TEXT`,
      `ALTER TABLE CatalogSettings ADD COLUMN giftHomeTitle TEXT`,
    ],
  },
  {
    table: "CatalogSettings",
    column: "giftHomeItems",
    ddls: [
      `ALTER TABLE "CatalogSettings" ADD COLUMN "giftHomeItems" TEXT`,
      `ALTER TABLE CatalogSettings ADD COLUMN giftHomeItems TEXT`,
    ],
  },
  {
    table: "CatalogSettings",
    column: "giftAutoTitle",
    ddls: [
      `ALTER TABLE "CatalogSettings" ADD COLUMN "giftAutoTitle" TEXT`,
      `ALTER TABLE CatalogSettings ADD COLUMN giftAutoTitle TEXT`,
    ],
  },
  {
    table: "CatalogSettings",
    column: "giftAutoItems",
    ddls: [
      `ALTER TABLE "CatalogSettings" ADD COLUMN "giftAutoItems" TEXT`,
      `ALTER TABLE CatalogSettings ADD COLUMN giftAutoItems TEXT`,
    ],
  },
  {
    table: "CatalogSettings",
    column: "giftCategoryCtaText",
    ddls: [
      `ALTER TABLE "CatalogSettings" ADD COLUMN "giftCategoryCtaText" TEXT`,
      `ALTER TABLE CatalogSettings ADD COLUMN giftCategoryCtaText TEXT`,
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
