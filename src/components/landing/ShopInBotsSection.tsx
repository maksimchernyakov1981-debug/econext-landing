"use client";

import type { ReactNode } from "react";
import { MaxIcon, TelegramIcon, UdsIcon, VkIcon } from "./ChannelBrandIcons";
import { trackEvent } from "./track";

type Channel = {
  key: string;
  href: string;
  label: string;
  eventType: string;
  icon: ReactNode;
};

export function ShopInBotsSection({
  partnerId,
  maxUrl,
  telegramUrl,
  vkUrl,
  udsUrl,
}: {
  partnerId: number | null;
  maxUrl: string | null;
  telegramUrl: string | null;
  vkUrl: string | null;
  udsUrl: string | null;
}) {
  const channels: Channel[] = [
    maxUrl && {
      key: "max",
      href: maxUrl,
      label: "В боте MAX",
      eventType: "click_catalog_max",
      icon: <MaxIcon className="h-7 w-7" />,
    },
    telegramUrl && {
      key: "tg",
      href: telegramUrl,
      label: "В Telegram",
      eventType: "click_catalog_telegram",
      icon: <TelegramIcon className="h-7 w-7" />,
    },
    vkUrl && {
      key: "vk",
      href: vkUrl,
      label: "В VK",
      eventType: "click_catalog_vk",
      icon: <VkIcon className="h-7 w-7" />,
    },
    udsUrl && {
      key: "uds",
      href: udsUrl,
      label: "В приложении",
      eventType: "click_catalog_uds",
      icon: <UdsIcon className="h-7 w-7" />,
    },
  ].filter(Boolean) as Channel[];

  if (channels.length === 0) return null;

  return (
    <section className="mb-5 rounded-2xl border border-cyan-100 bg-gradient-to-b from-white to-cyan-50/50 p-4">
      <h2 className="text-lg font-bold text-gray-900">Подобрать товар</h2>
      <p className="mt-1 text-sm text-gray-600">
        Откройте бот или приложение — там весь ассортимент EcoNext.
      </p>
      <div
        className={`mt-3 grid gap-2 ${
          channels.length >= 4 ? "grid-cols-2" : channels.length === 3 ? "grid-cols-3" : "grid-cols-2"
        }`}
      >
        {channels.map((ch) => (
          <a
            key={ch.key}
            href={ch.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent(ch.eventType, partnerId)}
            className="flex min-h-[52px] items-center gap-2.5 rounded-2xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm transition hover:border-primary/40 hover:bg-surface"
          >
            {ch.icon}
            <span className="text-sm font-semibold text-gray-900 leading-tight">{ch.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
