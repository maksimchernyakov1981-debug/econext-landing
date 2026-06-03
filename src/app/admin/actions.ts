"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { validateSlug, slugify } from "@/lib/slug";
import { normalizeExternalUrl } from "@/lib/links";
import { revalidateAllLanding } from "@/lib/revalidate-landing";
import { persistDbToBlob } from "@/lib/db-persist";
import { ensureDbReady } from "@/lib/ensure-db";
import {
  captureSettingsSnapshot,
  clearSettingsSnapshotCache,
  countDiscountContactLinks,
  ensurePrismaSyncedFromBlob,
  hydratePrismaFromSnapshot,
  loadSettingsSnapshot,
  persistSettingsSnapshot,
} from "@/lib/settings-backup";

async function guard() {
  const s = await requireAdmin();
  if (!s) throw new Error("Unauthorized");
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

type SaveResult = { ok?: boolean; error?: string; warning?: string; message?: string };

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

    const jsonSave = await persistSettingsSnapshot(snapshot);
    if (!jsonSave.ok) {
      return {
        error:
          jsonSave.message ??
          "Не сохранено в облако. Проверьте Blob Storage и Redeploy.",
      };
    }

    const dbSave = await persistDbToBlob();
    await ensureDbReady();

    const links = countDiscountContactLinks(snapshot.contacts);

    return {
      ok: true,
      message: `Сохранено в облако (${links} ссылок для скидки)`,
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
    const rejected: string[] = [];
    await prisma.mapSettings.update({
      where: { id: 1 },
      data: {
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
        mapSchemeImageUrl: data.mapSchemeImageUrl || null,
        mapSchemeCaption: data.mapSchemeCaption || null,
        mapSchemeIsActive: parseBool(data.mapSchemeIsActive ?? "true"),
      },
    });
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
    console.error(e);
    return { error: "Ошибка сохранения" };
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
    await prisma.contactSettings.update({
      where: { id: 1 },
      data: {
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
      },
    });
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
    await prisma.workScheduleDay.update({
      where: { dayOfWeek },
      data: {
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
      phone: data.phone || null,
      comment: data.comment || null,
      udsLink: cleanUrl(data.udsLink ?? "", "UDS партнёра", rejected),
      telegramBotLink: cleanUrl(data.telegramBotLink ?? "", "Telegram", rejected),
      maxBotLink: cleanUrl(data.maxBotLink ?? "", "MAX", rejected),
      telegramChannelLink: cleanUrl(data.telegramChannelLink ?? "", "TG канал", rejected),
      maxChannelLink: cleanUrl(data.maxChannelLink ?? "", "MAX канал", rejected),
      customHeroTitle: data.customHeroTitle || null,
      customHeroSubtitle: data.customHeroSubtitle || null,
      customHeroDescription: data.customHeroDescription || null,
      customQrText: data.customQrText || null,
      customGiftText: data.customGiftText || null,
      isActive: parseBool(data.isActive ?? "true"),
    };

    if (id) {
      await prisma.partner.update({ where: { id }, data: payload });
    } else {
      await prisma.partner.create({ data: payload });
    }
    const result = await afterAdminSave();
    revalidatePath("/admin/partners");
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
    return await afterAdminSave();
  } catch (e) {
    console.error(e);
    return { error: "Ошибка удаления" };
  }
}
