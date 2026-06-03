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
  const sorted = [...days].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  const blocks: string[] = [];

  for (const d of sorted) {
    const name = DAY_NAMES[d.dayOfWeek] ?? `День ${d.dayOfWeek}`;
    if (!d.isWorking) {
      blocks.push(`${name}:\nвыходной`);
      continue;
    }
    const sched = dayScheduleFromRow(d);
    const intervalLines = sched.intervals.map((i) => `${i.open}–${i.close}`);
    const lines = [name + ":", ...intervalLines];
    if (d.note) lines.push(d.note);
    blocks.push(lines.join("\n"));
  }

  return blocks.join("\n\n");
}
