export type WorkStatus = "open" | "break" | "before_open" | "closed";

export type ScheduleInterval = {
  open: string;
  close: string;
};

export type DaySchedule = {
  isWorking: boolean;
  intervals: ScheduleInterval[];
  openTime1?: string | null;
  closeTime1?: string | null;
  openTime2?: string | null;
  closeTime2?: string | null;
};

export type WorkStatusResult = {
  status: WorkStatus;
  title: string;
  description: string;
  todaySchedule: string;
  address: string;
  landmark: string | null;
  nextOpenTime?: string;
  closeTime?: string;
  specialNote?: string | null;
  schemeImageUrl?: string | null;
  schemeCaption?: string | null;
  mapLinks: {
    yandexMapsUrl?: string | null;
    yandexNavigatorUrl?: string | null;
    twoGisUrl?: string | null;
    googleMapsUrl?: string | null;
  };
};
