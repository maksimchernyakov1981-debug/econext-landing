"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { validateSlug, slugify } from "@/lib/slug";
import { isValidExternalUrl } from "@/lib/links";
import { revalidateAllLanding } from "@/lib/revalidate-landing";
import { persistDbToBlob } from "@/lib/db-persist";

async function guard() {
  const s = await requireAdmin();
  if (!s) throw new Error("Unauthorized");
}

function parseBool(v: string) {
  return v === "true" || v === "on" || v === "1";
}

function cleanUrl(v: string): string | null {
  const t = v.trim();
  if (!t) return null;
  if (!isValidExternalUrl(t)) return null;
  return t;
}

type SaveResult = { ok?: boolean; error?: string; warning?: string; message?: string };

async function afterAdminSave(): Promise<SaveResult> {
  await revalidateAllLanding();
  const blob = await persistDbToBlob();
  if (process.env.VERCEL === "1" && !blob.ok) {
    return {
      ok: true,
      warning:
        blob.message ??
        "Данные сохранены временно. Добавьте BLOB_READ_WRITE_TOKEN в Vercel для постоянного хранения.",
    };
  }
  return { ok: true, message: "Сохранено" };
}

/** Обновить кэш лендинга и записать БД в Blob (кнопка в шапке админки). */
export async function publishChanges(): Promise<SaveResult> {
  try {
    await guard();
    await revalidateAllLanding();
    const blob = await persistDbToBlob();
    if (process.env.VERCEL === "1" && !blob.ok) {
      return {
        ok: true,
        message: "Кэш страниц обновлён",
        warning:
          blob.message ??
          "База не записана в Blob — после перезапуска Vercel правки могут пропасть.",
      };
    }
    return { ok: true, message: "Изменения применены на сайте" };
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
    await prisma.mapSettings.update({
      where: { id: 1 },
      data: {
        storeName: data.storeName,
        address: data.address,
        landmark: data.landmark || null,
        yandexMapsUrl: cleanUrl(data.yandexMapsUrl ?? ""),
        yandexNavigatorUrl: cleanUrl(data.yandexNavigatorUrl ?? ""),
        twoGisUrl: cleanUrl(data.twoGisUrl ?? ""),
        googleMapsUrl: cleanUrl(data.googleMapsUrl ?? ""),
        mapSchemeImageUrl: data.mapSchemeImageUrl || null,
        mapSchemeCaption: data.mapSchemeCaption || null,
        mapSchemeIsActive: parseBool(data.mapSchemeIsActive ?? "true"),
      },
    });
    return await afterAdminSave();
  } catch (e) {
    console.error(e);
    return { error: "Ошибка сохранения" };
  }
}

export async function updateCatalog(data: Record<string, string>) {
  try {
    await guard();
    await prisma.catalogSettings.update({
      where: { id: 1 },
      data: {
        title: data.title,
        description: data.description,
        telegramCatalogText: data.telegramCatalogText || null,
        maxCatalogText: data.maxCatalogText || null,
        udsCatalogText: data.udsCatalogText || null,
        udsAppText: data.udsAppText || null,
        telegramCatalogUrl: cleanUrl(data.telegramCatalogUrl ?? ""),
        maxCatalogUrl: cleanUrl(data.maxCatalogUrl ?? ""),
        udsCatalogUrl: cleanUrl(data.udsCatalogUrl ?? ""),
        udsAppDownloadUrl: cleanUrl(data.udsAppDownloadUrl ?? ""),
        isActive: parseBool(data.isActive ?? "true"),
      },
    });
    return await afterAdminSave();
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
    await prisma.contactSettings.update({
      where: { id: 1 },
      data: {
        phone: data.phone || null,
        whatsappUrl: cleanUrl(data.whatsappUrl ?? ""),
        websiteUrl: cleanUrl(data.websiteUrl ?? ""),
        udsUrl: cleanUrl(data.udsUrl ?? ""),
        telegramBotUrl: cleanUrl(data.telegramBotUrl ?? ""),
        maxBotUrl: cleanUrl(data.maxBotUrl ?? ""),
        telegramChannelUrl: cleanUrl(data.telegramChannelUrl ?? ""),
        maxChannelUrl: cleanUrl(data.maxChannelUrl ?? ""),
        udsAppDownloadUrl: cleanUrl(data.udsAppDownloadUrl ?? ""),
        contactButtonText: data.contactButtonText || null,
        telegramChannelButtonText: data.telegramChannelButtonText || null,
        maxChannelButtonText: data.maxChannelButtonText || null,
        whatsappButtonText: data.whatsappButtonText || null,
        websiteButtonText: data.websiteButtonText || null,
      },
    });
    return await afterAdminSave();
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

    const payload = {
      name: data.name,
      slug,
      partnerType: data.partnerType || "hotel",
      contactName: data.contactName || null,
      phone: data.phone || null,
      comment: data.comment || null,
      udsLink: cleanUrl(data.udsLink ?? ""),
      telegramBotLink: cleanUrl(data.telegramBotLink ?? ""),
      maxBotLink: cleanUrl(data.maxBotLink ?? ""),
      telegramChannelLink: cleanUrl(data.telegramChannelLink ?? ""),
      maxChannelLink: cleanUrl(data.maxChannelLink ?? ""),
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
      yandexMapsUrl: cleanUrl(data.yandexMapsUrl ?? ""),
      yandexNavigatorUrl: cleanUrl(data.yandexNavigatorUrl ?? ""),
      twoGisUrl: cleanUrl(data.twoGisUrl ?? ""),
      googleMapsUrl: cleanUrl(data.googleMapsUrl ?? ""),
      schemeImageUrl: data.schemeImageUrl || null,
      schemeImageCaption: data.schemeImageCaption || null,
      isActive: parseBool(data.isActive ?? "true"),
    };

    if (id) {
      await prisma.specialDay.update({ where: { id }, data: payload });
    } else {
      await prisma.specialDay.create({ data: payload });
    }
    return await afterAdminSave();
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
