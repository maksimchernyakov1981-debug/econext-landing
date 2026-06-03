import { formatInTimeZone } from "date-fns-tz";
import { env } from "./env";

export function getTimezone(): string {
  return env.timezone();
}

export { getTimezone as getAppTimezone };

export function getTodayDateString(now = new Date()): string {
  return formatInTimeZone(now, getTimezone(), "yyyy-MM-dd");
}

export function getNowMinutes(now = new Date()): number {
  const hm = formatInTimeZone(now, getTimezone(), "HH:mm");
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
}

export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m ?? 0);
}
