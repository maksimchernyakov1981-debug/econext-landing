"use client";

import { useEffect } from "react";
import { trackEvent } from "./track";

export function PageTracker({ partnerId }: { partnerId: number | null }) {
  useEffect(() => {
    trackEvent("page_open", partnerId);
  }, [partnerId]);
  return null;
}
