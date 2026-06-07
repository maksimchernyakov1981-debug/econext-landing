"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { validateSlug, slugify } from "@/lib/slug";
import { normalizeExternalUrl } from "@/lib/links";
import { resolveSchemeImageUrl } from "@/lib/media-url";
import { revalidateAllLanding } from "@/lib/revalidate-landing";
import { persistDbToBlob } from "@/lib/db-persist";
import { ensureDbReady } from "@/lib/ensure-db";
import { ensureSqliteSchemaMigrations, filterMapSettingsForSqlite } from "@/lib/ensure-schema";
import {
  captureSettingsSnapshot,
  clearSettingsSnapshotCache,
  countDiscountContactLinks,
  ensurePrismaSyncedFromBlob,
  hydratePrismaFromSnapshot,
  loadSettingsSnapshot,
  normalizeMapRow,
  persistAndVerifySnapshot,
  persistSettingsSnapshot,
  useVercelSettingsBackup,
} from "@/lib/settings-backup";

async function guard() {
  const s = await requireAdmin();
  if (!s) throw new Error("Unauthorized");
  await ensureDbReady();
  await ensureSqliteSchemaMigrations();
  await ensurePrismaSyncedFromBlob();
}

function parseBool(v: string) {
  return v === "true" || v === "on" || v === "1";
}

function cleanUrl(v: string, label?: string, rejected?: string[]): string | null {
  const t = v.trim();
  if (!t) return null;
  const normalized = normalizeExternalUrl(t);
  if (!normalized) {
    rejected?.push(label ?? t);
    return null;
  }
  return normalized;
}

function joinWarnings(...parts: (string | undefined)[]): string | undefined {
  const s = parts.filter(Boolean).join(" ");
  return s || undefined;
}

type SaveResult = {
  ok?: boolean;
  error?: string;
  warning?: string;
  message?: string;
  partnerId?: number;
  landingSlug?: string;
};

async function afterAdminSave(): Promise<SaveResult> {
  await revalidateAllLanding();

  if (process.env.VERCEL === "1") {
    clearSettingsSnapshotCache();
    let snapshot;
    try {
      snapshot = await captureSettingsSnapshot();
    } catch (e) {
      console.error("[afterAdminSave] capture", e);
      return { error: "Не удалось прочитать настройки для сохранения" };
    }

    const verified = await persistAndVerifySnapshot(snapshot);
    if (!verified.ok) {
      return {
        error: verified.message ?? "Не сохранено в облако. Проверьте Blob Storage и Redeploy.",
      };
    }

    const dbSave = await persistDbToBlob();
    await ensureDbReady();

    const saved = verified.snapshot ?? snapshot;
    const links = countDiscountContactLinks(saved.contacts);

    return {
      ok: true,
      message: `Сохранено в облако (${links} ссылок для скидки). Сайт обновлён.`,
      warning: dbSave.ok ? undefined : `Копия SQLite: ${dbSave.message}`,
    };
  }

  return { ok: true, message: "Сохранено" };
}

/** Обновить кэш лендинга (не перезаписывает JSON — только после «Сохранить» в форме). */
export async function publishChanges(): Promise<SaveResult> {
  try {
    await guard();
    clearSettingsSnapshotCache();
    await revalidateAllLanding();

    if (process.env.VERCEL === "1") {
      const snap = await loadSettingsSnapshot();
      if (!snap) {
        return {
          error:
            "В облаке ещё нет настроек. Заполните форму ниже и нажмите «Сохранить», затем снова «Применить на сайте».",
        };
      }

      await hydratePrismaFromSnapshot(snap);
      const dbSave = await persistDbToBlob();
      await ensureDbReady();

      const linkCount = countDiscountContactLinks(snap.contacts);
      return {
        ok: true,
        message:
          linkCount === 0
            ? "Кэш обновлён, но ссылок UDS/Telegram/MAX в облаке нет — нажмите «Сохранить» в форме ниже."
            : `Применено на сайте. Ссылок для скидки: ${linkCount}`,
        warning: dbSave.ok ? undefined : dbSave.message,
      };
    }

    await persistDbToBlob();
    await ensureDbReady();
    return { ok: true, message: "Применено на сайте" };
  } catch (e) {
    console.error("[publishChanges]", e);
    return { error: "Не удалось применить изменения" };
  }
}

export async function updateLanding(data: Record<string, string>) {
  try {
    await guard();
    await prisma.landingSettings.update({
      where: { id: 1 },
      data: data as never,
    });
    return await afterAdminSave();
  } catch (e) {
    console.error(e);
    return { error: "Ошибка сохранения" };
  }
}

export async function updateButtons(data: Record<string, string>) {
  try {
    await guard();
    await prisma.buttonSettings.update({ where: { id: 1 }, data: data as never });
    return await afterAdminSave();
  } catch (e) {
    console.error(e);
    return { error: "Ошибка сохранения" };
  }
}

export async function updateMaps(data: Record<string, string>) {
  try {
    await guard();
    await ensureSqliteSchemaMigrations();
    const rejected: string[] = [];
    const mapData = {
      storeName: data.storeName,
      address: data.address,
      landmark: data.landmark || null,
      yandexMapsUrl: cleanUrl(data.yandexMapsUrl ?? "", "Яндекс Карты", rejected),
      yandexNavigatorUrl: cleanUrl(
        data.yandexNavigatorUrl ?? "",
        "Яндекс Навигатор",
        rejected
      ),
      twoGisUrl: cleanUrl(data.twoGisUrl ?? "", "2ГИС", rejected),
      googleMapsUrl: cleanUrl(data.googleMapsUrl ?? "", "Google Maps", rejected),
      mapSchemeImageUrl:
        resolveSchemeImageUrl(data.mapSchemeImageUrl?.trim()) ||
        data.mapSchemeImageUrl?.trim() ||
        null,
      mapSchemeCaption: data.mapSchemeCaption || null,
      mapSchemeIsActive: parseBool(data.mapSchemeIsActive ?? "true"),
      mapDisplayMode: ["image", "yandex", "2gis", "auto"].includes(data.mapDisplayMode)
        ? data.mapDisplayMode
        : "auto",
    };

    if (useVercelSettingsBackup()) {
      clearSettingsSnapshotCache();
      let snap = await loadSettingsSnapshot();
      if (!snap) {
        try {
          snap = await captureSettingsSnapshot();
        } catch (cap) {
          console.error("[updateMaps] capture", cap);
        }
      }
      if (!snap) {
        return { error: "Не удалось загрузить настройки. Обновите страницу и попробуйте снова." };
      }
      snap.map = {
        ...normalizeMapRow(snap.map),
        ...mapData,
        mapDisplayMode: mapData.mapDisplayMode,
      };
      const verified = await persistAndVerifySnapshot(snap);
      if (!verified.ok) {
        return {
          error:
            verified.message ??
            "Не сохранено в облако. Проверьте Blob Storage (BLOB_READ_WRITE_TOKEN).",
        };
      }

      try {
        await prisma.mapSettings.update({
          where: { id: 1 },
          data: await filterMapSettingsForSqlite(mapData),
        });
      } catch (dbErr) {
        console.error("[updateMaps] sqlite after json save", dbErr);
      }

      await revalidateAllLanding();
      await persistDbToBlob();
      const modeLabel =
        mapData.mapDisplayMode === "2gis"
          ? "2ГИС на лендинге"
          : mapData.mapDisplayMode === "yandex"
            ? "Яндекс на лендинге"
            : "настройки карт";
      const result: SaveResult = {
        ok: true,
        message: `Сохранено в облако (${modeLabel}).`,
      };
      if (rejected.length) {
        return {
          ...result,
          warning: `Не сохранены ссылки: ${rejected.join(", ")}`,
        };
      }
      return result;
    }

    await prisma.mapSettings.update({
      where: { id: 1 },
      data: await filterMapSettingsForSqlite(mapData),
    }).catch((e) => console.error("[updateMaps] local sqlite", e));

    const result = await afterAdminSave();
    if (rejected.length) {
      return {
        ...result,
        warning: joinWarnings(
          result.warning,
          `Не сохранены ссылки (проверьте формат): ${rejected.join(", ")}`
        ),
      };
    }
    return result;
  } catch (e) {
    console.error("[updateMaps]", e);
    const msg = e instanceof Error ? e.message : String(e);
    return { error: `Ошибка сохранения: ${msg.slice(0, 160)}` };
  }
}

export async function updateCatalog(data: Record<string, string>) {
  try {
    await guard();
    const rejected: string[] = [];
    await prisma.catalogSettings.update({
      where: { id: 1 },
      data: {
        title: data.title,
        description: data.description,
        telegramCatalogText: data.telegramCatalogText || null,
        maxCatalogText: data.maxCatalogText || null,
        udsCatalogText: data.udsCatalogText || null,
        udsAppText: data.udsAppText || null,
        telegramCatalogUrl: cleanUrl(
          data.telegramCatalogUrl ?? "",
          "Telegram ассортимент",
          rejected
        ),
        maxCatalogUrl: cleanUrl(data.maxCatalogUrl ?? "", "MAX ассортимент", rejected),
        udsCatalogUrl: cleanUrl(data.udsCatalogUrl ?? "", "UDS ассортимент", rejected),
        udsAppDownloadUrl: cleanUrl(data.udsAppDownloadUrl ?? "", "Скачать UDS", rejected),
        isActive: parseBool(data.isActive ?? "true"),
      },
    });
    const result = await afterAdminSave();
    if (rejected.length) {
      return {
        ...result,
        warning: joinWarnings(
          result.warning,
          `Не сохранены ссылки: ${rejected.join(", ")}`
        ),
      };
    }
    return result;
  } catch (e) {
    console.error(e);
    return { error: "Ошибка сохранения" };
  }
}

export async function updateQr(data: Record<string, string>) {
  try {
    await guard();
    await prisma.qrCardSettings.update({ where: { id: 1 }, data: data as never });
    return await afterAdminSave();
  } catch (e) {
    console.error(e);
    return { error: "Ошибка сохранения" };
  }
}

export async function updateContacts(data: Record<string, string>) {
  try {
    await guard();
    const rejected: string[] = [];
    const contactData = {
      phone: data.phone || null,
      whatsappUrl: cleanUrl(data.whatsappUrl ?? "", "WhatsApp", rejected),
      websiteUrl: cleanUrl(data.websiteUrl ?? "", "Сайт", rejected),
      udsUrl: cleanUrl(data.udsUrl ?? "", "UDS", rejected),
      telegramBotUrl: cleanUrl(data.telegramBotUrl ?? "", "Telegram-бот", rejected),
      maxBotUrl: cleanUrl(data.maxBotUrl ?? "", "MAX-бот", rejected),
      telegramChannelUrl: cleanUrl(
        data.telegramChannelUrl ?? "",
        "Telegram-канал",
        rejected
      ),
      maxChannelUrl: cleanUrl(data.maxChannelUrl ?? "", "MAX-канал", rejected),
      udsAppDownloadUrl: cleanUrl(data.udsAppDownloadUrl ?? "", "UDS приложение", rejected),
      contactButtonText: data.contactButtonText || null,
      telegramChannelButtonText: data.telegramChannelButtonText || null,
      maxChannelButtonText: data.maxChannelButtonText || null,
      whatsappButtonText: data.whatsappButtonText || null,
      websiteButtonText: data.websiteButtonText || null,
    };

    await prisma.contactSettings.update({
      where: { id: 1 },
      data: contactData,
    });

    if (useVercelSettingsBackup()) {
      clearSettingsSnapshotCache();
      let snap = await loadSettingsSnapshot();
      if (!snap) snap = await captureSettingsSnapshot();
      snap.contacts = { ...snap.contacts, ...contactData };
      const verified = await persistAndVerifySnapshot(snap);
      if (!verified.ok) {
        return { error: verified.message ?? "Не сохранено в облако" };
      }
      await revalidateAllLanding();
      await persistDbToBlob();
      const links = countDiscountContactLinks(verified.snapshot!.contacts);
      const result: SaveResult = {
        ok: true,
        message: `Сохранено в облако (${links} ссылок для скидки). Сайт обновлён.`,
      };
      if (rejected.length) {
        return {
          ...result,
          warning: `Не сохранены ссылки (нужен https:// или t.me/...): ${rejected.join(", ")}`,
        };
      }
      return result;
    }

    const result = await afterAdminSave();
    if (rejected.length) {
      return {
        ...result,
        warning: joinWarnings(
          result.warning,
          `Не сохранены ссылки (нужен https:// или t.me/...): ${rejected.join(", ")}`
        ),
      };
    }
    return result;
  } catch (e) {
    console.error(e);
    return { error: "Ошибка сохранения" };
  }
}

export async function updateScheduleDay(
  dayOfWeek: number,
  data: Record<string, string>
) {
  try {
    await guard();
    const { ensureScheduleDaysExist } = await import("@/lib/ensure-schedule");
    await ensureScheduleDaysExist();
    await prisma.workScheduleDay.upsert({
      where: { dayOfWeek },
      create: {
        dayOfWeek,
        isWorking: parseBool(data.isWorking ?? "true"),
        openTime1: data.openTime1 || null,
        closeTime1: data.closeTime1 || null,
        openTime2: data.openTime2 || null,
        closeTime2: data.closeTime2 || null,
        note: data.note || null,
      },
      update: {
        isWorking: parseBool(data.isWorking ?? "true"),
        openTime1: data.openTime1 || null,
        closeTime1: data.closeTime1 || null,
        openTime2: data.openTime2 || null,
        closeTime2: data.closeTime2 || null,
        note: data.note || null,
      },
    });
    return await afterAdminSave();
  } catch (e) {
    console.error(e);
    return { error: "Ошибка сохранения" };
  }
}

export async function savePartner(
  id: number | null,
  data: Record<string, string>
) {
  try {
    await guard();
    const slug = (data.slug || slugify(data.name)).trim().toLowerCase();
    const err = validateSlug(slug);
    if (err) return { error: err };

    const rejected: string[] = [];
    const payload = {
      name: data.name,
      slug,
      partnerType: data.partnerType || "hotel",
      contactName: data.contactName || null,
      phone: null,
      comment: data.comment || null,
      udsLink: cleanUrl(data.udsLink ?? "", "UDS партнёра", rejected),
      telegramBotLink: cleanUrl(data.telegramBotLink ?? "", "Telegram", rejected),
      maxBotLink: cleanUrl(data.maxBotLink ?? "", "MAX", rejected),
      telegramChannelLink: null,
      maxChannelLink: null,
      customHeroTitle: data.customHeroTitle || null,
      customHeroSubtitle: data.customHeroSubtitle || null,
      customHeroDescription: data.customHeroDescription || null,
      customQrText: data.customQrText || null,
      customGiftText: data.customGiftText || null,
      isActive: parseBool(data.isActive ?? "true"),
    };

    let partnerId = id;
    if (id) {
      await prisma.partner.update({ where: { id }, data: payload });
    } else {
      const created = await prisma.partner.create({ data: payload });
      partnerId = created.id;
    }
    const result = await afterAdminSave();
    revalidatePath("/admin/partners");
    if (rejected.length) {
      return {
        ...result,
        partnerId: partnerId ?? undefined,
        landingSlug: slug,
        warning: joinWarnings(
          result.warning,
          `Не сохранены ссылки: ${rejected.join(", ")}`
        ),
      };
    }
    return { ...result, partnerId: partnerId ?? undefined, landingSlug: slug };
  } catch (e) {
    console.error(e);
    return { error: "Ошибка сохранения" };
  }
}

export async function deletePartner(id: number) {
  try {
    await guard();
    await prisma.partner.delete({ where: { id } });
    const result = await afterAdminSave();
    revalidatePath("/admin/partners");
    return result;
  } catch (e) {
    console.error(e);
    return { error: "Ошибка удаления" };
  }
}

export async function saveSpecialDay(
  id: number | null,
  data: Record<string, string>
) {
  try {
    await guard();
    const rejected: string[] = [];
    const payload = {
      date: data.date,
      status: data.status,
      title: data.title || null,
      description: data.description || null,
      locationName: data.locationName || null,
      address: data.address || null,
      landmark: data.landmark || null,
      openTime1: data.openTime1 || null,
      closeTime1: data.closeTime1 || null,
      openTime2: data.openTime2 || null,
      closeTime2: data.closeTime2 || null,
      yandexMapsUrl: cleanUrl(data.yandexMapsUrl ?? "", "Яндекс Карты", rejected),
      yandexNavigatorUrl: cleanUrl(
        data.yandexNavigatorUrl ?? "",
        "Яндекс Навигатор",
        rejected
      ),
      twoGisUrl: cleanUrl(data.twoGisUrl ?? "", "2ГИС", rejected),
      googleMapsUrl: cleanUrl(data.googleMapsUrl ?? "", "Google Maps", rejected),
      schemeImageUrl: data.schemeImageUrl || null,
      schemeImageCaption: data.schemeImageCaption || null,
      isActive: parseBool(data.isActive ?? "true"),
    };

    if (id) {
      await prisma.specialDay.update({ where: { id }, data: payload });
    } else {
      await prisma.specialDay.create({ data: payload });
    }
    const result = await afterAdminSave();
    if (rejected.length) {
      return {
        ...result,
        warning: joinWarnings(
          result.warning,
          `Не сохранены ссылки: ${rejected.join(", ")}`
        ),
      };
    }
    return result;
  } catch (e) {
    console.error(e);
    return { error: "Ошибка сохранения" };
  }
}

export async function deleteSpecialDay(id: number) {
  try {
    await guard();
    await prisma.specialDay.delete({ where: { id } });
    return await afterAdminSave();
  } catch (e) {
    console.error(e);
    return { error: "Ошибка удаления" };
  }
}

export async function saveMediaAsset(
  id: number | null,
  data: Record<string, string>
) {
  try {
    await guard();
    const payload = {
      type: data.type,
      title: data.title || null,
      url: data.url,
      altText: data.altText || null,
      sortOrder: Number(data.sortOrder || 0),
      isActive: parseBool(data.isActive ?? "true"),
    };
    if (id) {
      await prisma.mediaAsset.update({ where: { id }, data: payload });
    } else {
      await prisma.mediaAsset.create({ data: payload });
    }
    revalidatePath("/admin/media");
    await revalidateAllLanding();
    return await afterAdminSave();
  } catch (e) {
    console.error(e);
    return { error: "Ошибка сохранения" };
  }
}

export async function deleteMediaAsset(id: number) {
  try {
    await guard();
    await prisma.mediaAsset.delete({ where: { id } });
    revalidatePath("/admin/media");
    await revalidateAllLanding();
    return await afterAdminSave();
  } catch (e) {
    console.error(e);
    return { error: "Ошибка удаления" };
  }
}
