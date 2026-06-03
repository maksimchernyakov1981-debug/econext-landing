import { describe, it, expect } from "vitest";
import { getTodayWorkStatusFromData } from "./getTodayWorkStatus";
import type { LandingSettings, MapSettings } from "@prisma/client";

const landing = {
  openStatusTitle: "open",
  breakStatusTitle: "break",
  beforeOpenStatusTitle: "before",
  closedStatusTitle: "closed",
  openStatusText: "[today_schedule]",
  breakStatusText: "break [next_open_time] [close_time]",
  beforeOpenStatusText: "before",
  closedStatusText: "closed",
} as LandingSettings;

const map = {
  storeName: "EcoNext",
  address: "Addr",
  landmark: "Land",
  yandexMapsUrl: null,
  yandexNavigatorUrl: null,
  twoGisUrl: null,
  googleMapsUrl: null,
  mapSchemeImageUrl: null,
  mapSchemeCaption: null,
  mapSchemeIsActive: true,
} as MapSettings;

describe("getTodayWorkStatusFromData", () => {
  it("returns closed for non-working day", () => {
    const result = getTodayWorkStatusFromData({
      landing,
      map,
      scheduleDays: [
        {
          id: 1,
          dayOfWeek: 1,
          isWorking: false,
          openTime1: null,
          closeTime1: null,
          openTime2: null,
          closeTime2: null,
          note: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      specialDay: null,
      dayOfWeek: 1,
    });
    expect(result.status).toBe("closed");
  });
});
