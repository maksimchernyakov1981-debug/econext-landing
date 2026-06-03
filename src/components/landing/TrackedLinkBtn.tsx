"use client";

import { trackEvent } from "./track";

export function TrackedLinkBtn({
  href,
  label,
  eventType,
  partnerId,
}: {
  href: string;
  label: string;
  eventType: string;
  partnerId: number | null;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent(eventType, partnerId)}
      className="flex min-h-[48px] items-center justify-center rounded-2xl bg-primary text-white font-medium text-base px-4 py-3 w-full"
    >
      {label}
    </a>
  );
}
