import { describe, expect, it } from "vitest";
import { filterAnalyticsEvents, type AnalyticsEvent } from "./analytics-blob";

const baseEvent: AnalyticsEvent = {
  id: "1",
  eventType: "page_open",
  partnerId: null,
  sessionId: "session-1",
  createdAt: "2026-11-03T10:00:00.000Z",
  ipHash: null,
};

describe("filterAnalyticsEvents", () => {
  it("относит старые события без site к лендингу", () => {
    const events = [baseEvent];
    expect(
      filterAnalyticsEvents(events, { since: null, site: "landing" })
    ).toHaveLength(1);
    expect(
      filterAnalyticsEvents(events, { since: null, site: "main" })
    ).toHaveLength(0);
  });

  it("разделяет события главного сайта и лендинга", () => {
    const events: AnalyticsEvent[] = [
      { ...baseEvent, id: "main", site: "main" },
      { ...baseEvent, id: "landing", site: "landing" },
    ];
    expect(
      filterAnalyticsEvents(events, { since: null, site: "main" }).map(
        (event) => event.id
      )
    ).toEqual(["main"]);
  });
});
