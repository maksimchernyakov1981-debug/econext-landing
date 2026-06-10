import type { LandingSettings, MapSettings, SpecialDay, WorkScheduleDay } from "@prisma/client";
import { replaceTemplateVars, type TemplateContext } from "../templates";
import { formatInTimeZone } from "date-fns-tz";
import { getNowMinutes, getTimezone, parseTimeToMinutes } from "../timezone";
import {
  dayScheduleFromRow,
  formatTodaySchedule,
} from "./formatSchedule";
import { sanitizeLandmark } from "@/lib/map-defaults";
import { mapLinksFromSettings, mergeMapLinksForSpecialDay } from "@/lib/map-links";
import type { DaySchedule, WorkStatus, WorkStatusResult } from "./types";

function resolveStatus(day: DaySchedule, nowMin: number): {
  status: WorkStatus;
  nextOpenTime?: string;
  closeTime?: string;
} {
  if (!day.isWorking || day.intervals.length === 0) {
    return { status: "closed" };
  }

  const first = day.intervals[0];
  const last = day.intervals[day.intervals.length - 1];
  const firstOpen = parseTimeToMinutes(first.open);
  const lastClose = parseTimeToMinutes(last.close);

  if (nowMin < firstOpen) {
    return { status: "before_open", nextOpenTime: first.open, closeTime: last.close };
  }

  for (let i = 0; i < day.intervals.length; i++) {
    const interval = day.intervals[i];
    const open = parseTimeToMinutes(interval.open);
    const close = parseTimeToMinutes(interval.close);
    if (nowMin >= open && nowMin <= close) {
      return { status: "open", closeTime: last.close };
    }
    const next = day.intervals[i + 1];
    if (next && nowMin > close && nowMin < parseTimeToMinutes(next.open)) {
      return {
        status: "break",
        nextOpenTime: next.open,
        closeTime: last.close,
      };
    }
  }

  if (nowMin > lastClose) {
    return { status: "closed", closeTime: last.close };
  }

  return { status: "closed", closeTime: last.close };
}

export function buildWorkStatusResult(params: {
  landing: LandingSettings;
  map: MapSettings;
  day: DaySchedule;
  status: WorkStatus;
  nextOpenTime?: string;
  closeTime?: string;
  address?: string;
  landmark?: string | null;
  specialNote?: string | null;
  schemeImageUrl?: string | null;
  schemeCaption?: string | null;
  mapLinks?: WorkStatusResult["mapLinks"];
  partnerName?: string;
}): WorkStatusResult {
  const address = params.address ?? params.map.address;
  const landmark = sanitizeLandmark(params.landmark ?? params.map.landmark);
  const todaySchedule = formatTodaySchedule(params.day);

  const ctx: TemplateContext = {
    partner_name: params.partnerName,
    store_name: params.map.storeName,
    address,
    landmark: landmark ?? "",
    today_schedule: todaySchedule,
    next_open_time: params.nextOpenTime,
    close_time: params.closeTime,
  };

  let title = "";
  let description = "";

  switch (params.status) {
    case "open":
      title = params.landing.openStatusTitle;
      description =
        replaceTemplateVars(params.landing.openStatusText, ctx) || todaySchedule;
      break;
    case "break":
      title = params.landing.breakStatusTitle;
      description = replaceTemplateVars(params.landing.breakStatusText, ctx);
      break;
    case "before_open":
      title = params.landing.beforeOpenStatusTitle;
      description = replaceTemplateVars(params.landing.beforeOpenStatusText, ctx);
      break;
    case "closed":
      title = params.landing.closedStatusTitle;
      description = replaceTemplateVars(params.landing.closedStatusText, ctx);
      break;
  }

  ctx.work_status = title;

  return {
    status: params.status,
    title: replaceTemplateVars(title, ctx),
    description: replaceTemplateVars(description, ctx),
    todaySchedule,
    address,
    landmark,
    nextOpenTime: params.nextOpenTime,
    closeTime: params.closeTime,
    specialNote: params.specialNote,
    schemeImageUrl: params.schemeImageUrl,
    schemeCaption: params.schemeCaption,
    mapLinks: params.mapLinks ?? mapLinksFromSettings(params.map),
  };
}

export function getTodayWorkStatusFromData(params: {
  landing: LandingSettings;
  map: MapSettings;
  scheduleDays: WorkScheduleDay[];
  specialDay: SpecialDay | null;
  dayOfWeek: number;
  partnerName?: string;
}): WorkStatusResult {
  const { landing, map, specialDay } = params;
  const nowMin = getNowMinutes();

  if (specialDay?.isActive) {
    const address = specialDay.address ?? map.address;
    const mapLinks = mergeMapLinksForSpecialDay(specialDay, map, address);
    const landmark = sanitizeLandmark(specialDay.landmark ?? map.landmark);

    if (specialDay.status === "closed") {
      return buildWorkStatusResult({
        landing,
        map,
        day: { isWorking: false, intervals: [] },
        status: "closed",
        address,
        landmark,
        specialNote: specialDay.description,
        schemeImageUrl: specialDay.schemeImageUrl,
        schemeCaption: specialDay.schemeImageCaption,
        mapLinks,
        partnerName: params.partnerName,
      });
    }

    const day = dayScheduleFromRow({
      isWorking: specialDay.status !== "closed",
      openTime1: specialDay.openTime1,
      closeTime1: specialDay.closeTime1,
      openTime2: specialDay.openTime2,
      closeTime2: specialDay.closeTime2,
    });
    const { status, nextOpenTime, closeTime } = resolveStatus(day, nowMin);
    return buildWorkStatusResult({
      landing,
      map,
      day,
      status,
      nextOpenTime,
      closeTime,
      address,
      landmark,
      specialNote: specialDay.description,
      schemeImageUrl: specialDay.schemeImageUrl,
      schemeCaption: specialDay.schemeImageCaption,
      mapLinks,
      partnerName: params.partnerName,
    });
  }

  const row =
    params.scheduleDays.find((d) => d.dayOfWeek === params.dayOfWeek) ??
    params.scheduleDays[0];
  const day = row
    ? dayScheduleFromRow(row)
    : { isWorking: false, intervals: [] as DaySchedule["intervals"] };
  const { status, nextOpenTime, closeTime } = resolveStatus(day, nowMin);

  const schemeUrl = map.mapSchemeIsActive ? map.mapSchemeImageUrl : null;

  return buildWorkStatusResult({
    landing,
    map,
    day,
    status,
    nextOpenTime,
    closeTime,
    schemeImageUrl: schemeUrl,
    schemeCaption: map.mapSchemeCaption,
    partnerName: params.partnerName,
  });
}

/** 1 = Monday … 7 = Sunday in APP_TIMEZONE */
export function getDayOfWeek(now = new Date()): number {
  return Number(formatInTimeZone(now, getTimezone(), "i"));
}
