import type { WorkScheduleDay } from "@prisma/client";
import type { DaySchedule } from "./types";

const DAY_NAMES = ["", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

export function dayScheduleFromRow(row: {
  isWorking: boolean;
  openTime1: string | null;
  closeTime1: string | null;
  openTime2: string | null;
  closeTime2: string | null;
}): DaySchedule {
  const intervals: DaySchedule["intervals"] = [];
  if (row.openTime1 && row.closeTime1) {
    intervals.push({ open: row.openTime1, close: row.closeTime1 });
  }
  if (row.openTime2 && row.closeTime2) {
    intervals.push({ open: row.openTime2, close: row.closeTime2 });
  }
  return {
    isWorking: row.isWorking,
    intervals,
    openTime1: row.openTime1,
    closeTime1: row.closeTime1,
    openTime2: row.openTime2,
    closeTime2: row.closeTime2,
  };
}

export function formatTodaySchedule(day: DaySchedule): string {
  if (!day.isWorking || day.intervals.length === 0) return "Выходной";
  return day.intervals.map((i) => `${i.open}–${i.close}`).join(", ");
}

export function formatFullSchedule(days: WorkScheduleDay[]): string {
  const groups = new Map<string, number[]>();
  for (const d of days.sort((a, b) => a.dayOfWeek - b.dayOfWeek)) {
    if (!d.isWorking) {
      const key = "off";
      const arr = groups.get(key) ?? [];
      arr.push(d.dayOfWeek);
      groups.set(key, arr);
      continue;
    }
    const key = `${d.openTime1}-${d.closeTime1}-${d.openTime2}-${d.closeTime2}`;
    const arr = groups.get(key) ?? [];
    arr.push(d.dayOfWeek);
    groups.set(key, arr);
  }

  const lines: string[] = [];
  for (const [key, dayNums] of groups) {
    const names = dayNums.map((n) => DAY_NAMES[n]).join(", ");
    if (key === "off") {
      lines.push(`${names}: выходной`);
      continue;
    }
    const sample = days.find((d) => d.dayOfWeek === dayNums[0]);
    if (!sample) continue;
    const sched = formatTodaySchedule(dayScheduleFromRow(sample));
    lines.push(`${names}:\n${sched.replace(", ", "\n")}`);
    if (sample.note) lines.push(`(${sample.note})`);
  }
  return lines.join("\n\n");
}
