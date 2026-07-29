"use client";

import type { ReactNode } from "react";
import { telLink } from "@/lib/links";
import { MaxIcon, TelegramIcon, UdsIcon, VkIcon } from "./ChannelBrandIcons";
import { trackEvent } from "./track";
import type { LandingViewProps } from "./types";

type IconLink = {
  key: string;
  href: string;
  label: string;
  eventType: string;
  icon: ReactNode;
};

export function ContactFooter({
  data,
  partnerId,
  maxUrl,
  telegramUrl,
  vkUrl,
  udsUrl,
}: {
  data: LandingViewProps;
  partnerId?: number | null;
  maxUrl?: string | null;
  telegramUrl?: string | null;
  vkUrl?: string | null;
  udsUrl?: string | null;
}) {
  const pid = partnerId ?? data.partner?.id ?? null;
  const icons: IconLink[] = [
    (maxUrl || data.contacts.maxBotUrl || data.contacts.maxChannelUrl) && {
      key: "max",
      href: (maxUrl || data.contacts.maxBotUrl || data.contacts.maxChannelUrl)!,
      label: "MAX",
      eventType: "click_max",
      icon: <MaxIcon className="h-9 w-9" />,
    },
    (telegramUrl || data.contacts.telegramBotUrl || data.contacts.telegramChannelUrl) && {
      key: "tg",
      href: (telegramUrl ||
        data.contacts.telegramBotUrl ||
        data.contacts.telegramChannelUrl)!,
      label: "Telegram",
      eventType: "click_telegram",
      icon: <TelegramIcon className="h-9 w-9" />,
    },
    (vkUrl || data.contacts.vkBotUrl) && {
      key: "vk",
      href: (vkUrl || data.contacts.vkBotUrl)!,
      label: "VK",
      eventType: "click_vk",
      icon: <VkIcon className="h-9 w-9" />,
    },
    (udsUrl || data.contacts.udsUrl || data.contacts.udsAppDownloadUrl) && {
      key: "uds",
      href: (udsUrl || data.contacts.udsUrl || data.contacts.udsAppDownloadUrl)!,
      label: "UDS",
      eventType: "click_uds",
      icon: <UdsIcon className="h-9 w-9" />,
    },
  ].filter(Boolean) as IconLink[];

  return (
    <footer className="text-xs text-center text-muted mt-8">
      {data.landing.privacyFooterText}

      {icons.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
          {icons.map((item) => (
            <a
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              title={item.label}
              aria-label={item.label}
              onClick={() => trackEvent(item.eventType, pid)}
              className="rounded-xl transition hover:scale-105 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              {item.icon}
            </a>
          ))}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {data.contacts.telegramChannelUrl && (
          <a
            className="text-primary underline"
            href={data.contacts.telegramChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.contacts.telegramChannelButtonText}
          </a>
        )}
        {data.contacts.maxChannelUrl && (
          <a
            className="text-primary underline"
            href={data.contacts.maxChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.contacts.maxChannelButtonText}
          </a>
        )}
        {data.contacts.whatsappUrl && (
          <a
            className="text-primary underline"
            href={data.contacts.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.contacts.whatsappButtonText}
          </a>
        )}
        {data.contacts.websiteUrl && (
          <a
            className="text-primary underline"
            href={data.contacts.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.contacts.websiteButtonText}
          </a>
        )}
        {telLink(data.contacts.phone) && (
          <a className="text-primary underline" href={telLink(data.contacts.phone)!}>
            {data.contacts.contactButtonText || data.contacts.phone}
          </a>
        )}
      </div>
    </footer>
  );
}
