"use client";

import { useEffect } from "react";
import { trackEvent } from "./track";

export function ScreenTracker({
  eventType,
  partnerId,
}: {
  eventType: string;
  partnerId: number | null;
}) {
  useEffect(() => {
    trackEvent(eventType, partnerId);
  }, [eventType, partnerId]);
  return null;
}
