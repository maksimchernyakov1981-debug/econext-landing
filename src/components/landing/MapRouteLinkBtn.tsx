"use client";

import type { YandexRouteLink } from "@/lib/yandex-route-links";
import { trackEvent } from "./track";

function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

export function MapRouteLinkBtn({
  link,
  label,
  eventType,
  partnerId,
  variant = "primary",
  preferApp = false,
}: {
  link: YandexRouteLink;
  label: string;
  eventType: string;
  partnerId: number | null;
  variant?: "primary" | "secondary" | "outline" | "accent";
  /** true для Навигатора — на телефоне открываем yandexnavi:// */
  preferApp?: boolean;
}) {
  const styles = {
    primary: "bg-primary text-white shadow-md shadow-green-900/15 hover:bg-[#156b3f]",
    secondary: "bg-white text-primary border-2 border-primary/30 hover:bg-surface",
    outline: "bg-white text-gray-800 border border-gray-200 hover:border-primary/40 hover:bg-surface",
    accent:
      "bg-accent text-gray-900 shadow-md shadow-amber-200/50 hover:brightness-105 ring-2 ring-amber-300/60",
  };

  const href =
    preferApp && isMobileDevice() && link.appUrl ? link.appUrl : link.webUrl;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent(eventType, partnerId)}
      className={`flex min-h-[52px] items-center justify-center gap-2 rounded-2xl font-semibold text-base px-4 py-3 w-full transition ${styles[variant]}`}
    >
      {label}
    </a>
  );
}
