import type { Partner } from "@prisma/client";
import { ensureDbReady } from "./ensure-db";
import { prisma } from "./prisma";
import { getTodayDateString } from "./timezone";
import { getDayOfWeek, getTodayWorkStatusFromData } from "./schedule/getTodayWorkStatus";
import { formatFullSchedule } from "./schedule/formatSchedule";

export async function getSingletonSettings() {
  await ensureDbReady();
  const [
    landing,
    buttons,
    map,
    catalog,
    qr,
    contacts,
    scheduleDays,
  ] = await Promise.all([
    prisma.landingSettings.findFirst({ where: { id: 1 } }),
    prisma.buttonSettings.findFirst({ where: { id: 1 } }),
    prisma.mapSettings.findFirst({ where: { id: 1 } }),
    prisma.catalogSettings.findFirst({ where: { id: 1 } }),
    prisma.qrCardSettings.findFirst({ where: { id: 1 } }),
    prisma.contactSettings.findFirst({ where: { id: 1 } }),
    prisma.workScheduleDay.findMany({ orderBy: { dayOfWeek: "asc" } }),
  ]);

  if (!landing || !buttons || !map || !catalog || !qr || !contacts) {
    throw new Error("Run prisma db seed — missing singleton settings");
  }

  return { landing, buttons, map, catalog, qr, contacts, scheduleDays };
}

export async function getPartnerBySlug(slug: string) {
  return prisma.partner.findUnique({ where: { slug } });
}

export async function getLandingContext(partner: Partner | null) {
  const settings = await getSingletonSettings();
  const today = getTodayDateString();
  const specialDay = await prisma.specialDay.findFirst({
    where: { date: today, isActive: true },
  });

  const dayOfWeek = getDayOfWeek();

  const workStatus = getTodayWorkStatusFromData({
    landing: settings.landing,
    map: settings.map,
    scheduleDays: settings.scheduleDays,
    specialDay,
    dayOfWeek,
    partnerName: partner?.name,
  });

  const fullScheduleText = formatFullSchedule(settings.scheduleDays);

  return {
    ...settings,
    partner,
    workStatus,
    fullScheduleText,
    specialDay,
  };
}
