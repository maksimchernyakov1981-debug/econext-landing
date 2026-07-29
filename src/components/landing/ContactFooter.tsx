"use client";

import type { ReactNode } from "react";
import { telLink } from "@/lib/links";
import { MaxIcon, TelegramIcon, UdsIcon, VkIcon } from "./ChannelBrandIcons";
import { GlobeIcon, MessageIcon, PhoneIcon } from "./LandingUiIcons";
import { trackEvent } from "./track";
import type { LandingViewProps } from "./types";

type IconLink = {
  key: string;
  href: string;
  label: string;
  eventType: string;
  icon: ReactNode;
};

type FooterLink = {
  key: string;
  href: string;
  label: string;
  external?: boolean;
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
      label: "MAX-бот",
      eventType: "click_max",
      icon: <MaxIcon className="h-10 w-10" udsBadge />,
    },
    (telegramUrl || data.contacts.telegramBotUrl || data.contacts.telegramChannelUrl) && {
      key: "tg",
      href: (telegramUrl ||
        data.contacts.telegramBotUrl ||
        data.contacts.telegramChannelUrl)!,
      label: "Telegram-бот",
      eventType: "click_telegram",
      icon: <TelegramIcon className="h-10 w-10" udsBadge />,
    },
    (vkUrl || data.contacts.vkBotUrl) && {
      key: "vk",
      href: (vkUrl || data.contacts.vkBotUrl)!,
      label: "VK-бот",
      eventType: "click_vk",
      icon: <VkIcon className="h-10 w-10" udsBadge />,
    },
    (udsUrl || data.contacts.udsUrl || data.contacts.udsAppDownloadUrl) && {
      key: "uds",
      href: (udsUrl || data.contacts.udsUrl || data.contacts.udsAppDownloadUrl)!,
      label: "UDS",
      eventType: "click_uds",
      icon: <UdsIcon className="h-10 w-10" />,
    },
  ].filter(Boolean) as IconLink[];

  const footerLinks: FooterLink[] = [
    data.contacts.telegramChannelUrl && {
      key: "telegram-channel",
      href: data.contacts.telegramChannelUrl,
      label: data.contacts.telegramChannelButtonText,
      external: true,
      icon: <TelegramIcon className="h-5 w-5" />,
    },
    data.contacts.maxChannelUrl && {
      key: "max-channel",
      href: data.contacts.maxChannelUrl,
      label: data.contacts.maxChannelButtonText,
      external: true,
      icon: <MaxIcon className="h-5 w-5" />,
    },
    data.contacts.whatsappUrl && {
      key: "whatsapp",
      href: data.contacts.whatsappUrl,
      label: data.contacts.whatsappButtonText,
      external: true,
      icon: <MessageIcon className="h-5 w-5" />,
    },
    data.contacts.websiteUrl && {
      key: "website",
      href: data.contacts.websiteUrl,
      label: data.contacts.websiteButtonText,
      external: true,
      icon: <GlobeIcon className="h-5 w-5" />,
    },
    telLink(data.contacts.phone) && {
      key: "phone",
      href: telLink(data.contacts.phone)!,
      label: data.contacts.contactButtonText || data.contacts.phone,
      icon: <PhoneIcon className="h-5 w-5" />,
    },
  ].filter(Boolean) as FooterLink[];

  return (
    <footer className="text-xs text-center text-muted mt-8">
      {data.landing.privacyFooterText}

      {icons.length > 0 && (
        <div className="mx-auto mt-5 grid max-w-sm grid-cols-4 gap-2">
          {icons.map((item) => (
            <a
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              title={item.label}
              aria-label={item.label}
              onClick={() => trackEvent(item.eventType, pid)}
              className="flex min-w-0 flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white px-1 py-3 text-[10px] font-semibold leading-tight text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      )}

      {footerLinks.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {footerLinks.map((item) => (
            <a
              key={item.key}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-primary/15 bg-white px-3 py-1.5 font-medium text-primary no-underline transition hover:border-primary/35 hover:bg-surface"
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      )}
    </footer>
  );
}
