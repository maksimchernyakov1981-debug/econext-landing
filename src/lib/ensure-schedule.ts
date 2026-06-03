import { prisma } from "./prisma";

const DEFAULT_DAYS: {
  dayOfWeek: number;
  isWorking: boolean;
  openTime1: string | null;
  closeTime1: string | null;
  openTime2?: string | null;
  closeTime2?: string | null;
  note?: string | null;
}[] = [
  { dayOfWeek: 1, isWorking: true, openTime1: "15:30", closeTime1: "20:00", note: "работаем вечером" },
  {
    dayOfWeek: 2,
    isWorking: true,
    openTime1: "10:00",
    closeTime1: "14:00",
    openTime2: "15:00",
    closeTime2: "20:00",
    note: "перерыв 14:00–15:00",
  },
  {
    dayOfWeek: 3,
    isWorking: true,
    openTime1: "10:00",
    closeTime1: "14:00",
    openTime2: "15:00",
    closeTime2: "20:00",
    note: "перерыв 14:00–15:00",
  },
  {
    dayOfWeek: 4,
    isWorking: true,
    openTime1: "10:00",
    closeTime1: "14:00",
    openTime2: "15:00",
    closeTime2: "20:00",
    note: "перерыв 14:00–15:00",
  },
  {
    dayOfWeek: 5,
    isWorking: true,
    openTime1: "10:00",
    closeTime1: "14:00",
    openTime2: "15:00",
    closeTime2: "20:00",
    note: "перерыв 14:00–15:00",
  },
  {
    dayOfWeek: 6,
    isWorking: true,
    openTime1: "10:00",
    closeTime1: "14:00",
    openTime2: "15:00",
    closeTime2: "20:00",
    note: "перерыв 14:00–15:00",
  },
  { dayOfWeek: 7, isWorking: true, openTime1: "10:00", closeTime1: "20:00", note: "воскресенье" },
];

/** Гарантирует 7 строк графика (иначе админка «График» падает на пустой БД). */
export async function ensureScheduleDaysExist(): Promise<void> {
  const count = await prisma.workScheduleDay.count();
  if (count >= 7) return;

  for (const d of DEFAULT_DAYS) {
    await prisma.workScheduleDay.upsert({
      where: { dayOfWeek: d.dayOfWeek },
      create: {
        dayOfWeek: d.dayOfWeek,
        isWorking: d.isWorking,
        openTime1: d.openTime1,
        closeTime1: d.closeTime1,
        openTime2: d.openTime2 ?? null,
        closeTime2: d.closeTime2 ?? null,
        note: d.note ?? null,
      },
      update: {},
    });
  }
}
