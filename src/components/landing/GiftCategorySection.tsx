"use client";

import { useState } from "react";
import type { ButtonSettings, CatalogSettings } from "@prisma/client";
import {
  getGiftCategories,
  normalizeGiftCategorySettings,
  type GiftCategoryKey,
} from "@/lib/gift-categories";
import { trackEvent } from "./track";
import { TrackedLinkBtn } from "./TrackedLinkBtn";

type CategoryLinks = {
  telegram: string | null;
  max: string | null;
  vk: string | null;
  uds: string | null;
  website: string | null;
  udsApp: string | null;
};

export function GiftCategorySection({
  catalog,
  buttons,
  links,
  partnerId,
}: {
  catalog: CatalogSettings;
  buttons: ButtonSettings;
  links: CategoryLinks;
  partnerId: number | null;
}) {
  const settings = normalizeGiftCategorySettings(catalog);
  const categories = getGiftCategories(settings);
  const [selected, setSelected] = useState<GiftCategoryKey | null>(null);
  const [channelsOpen, setChannelsOpen] = useState(false);
  const active = categories.find((category) => category.key === selected) ?? null;
  const hasAnyLink = Object.values(links).some(Boolean);

  const selectCategory = (key: GiftCategoryKey, eventType: string) => {
    const next = selected === key ? null : key;
    setSelected(next);
    setChannelsOpen(false);
    if (next) trackEvent(eventType, partnerId);
  };

  const openChannels = () => {
    setChannelsOpen(true);
    trackEvent("click_gift_category_cta", partnerId);
  };

  return (
    <section className="mb-5 rounded-2xl border border-cyan-100 bg-gradient-to-b from-white to-cyan-50/50 p-4">
      <h2 className="text-lg font-bold text-gray-900">
        {settings.giftCategoryTitle}
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        {settings.giftCategoryDescription}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {categories.map((category) => {
          const isActive = category.key === selected;
          return (
            <button
              key={category.key}
              type="button"
              aria-pressed={isActive}
              aria-controls="gift-category-details"
              onClick={() => selectCategory(category.key, category.eventType)}
              className={`min-h-[82px] rounded-2xl px-2 py-3 text-center transition ${
                isActive
                  ? "bg-primary text-white shadow-md shadow-green-900/15"
                  : "border border-gray-200 bg-white text-gray-900 shadow-sm hover:border-primary/40 hover:bg-surface"
              }`}
            >
              <span className="block text-2xl" aria-hidden>
                {category.icon}
              </span>
              <span className="mt-1 block text-sm font-semibold leading-tight">
                {category.title}
              </span>
            </button>
          );
        })}
      </div>

      {active && (
        <div
          id="gift-category-details"
          className="mt-4 rounded-2xl border border-green-100 bg-white p-4"
        >
          <h3 className="font-bold text-gray-900">
            {active.icon} {active.title}
          </h3>
          <ul className="mt-3 space-y-2">
            {active.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-gray-800"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {!channelsOpen && (
            <button
              type="button"
              onClick={openChannels}
              className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-accent px-4 py-3 text-base font-semibold text-gray-900 shadow-md shadow-amber-200/50 ring-2 ring-amber-300/60"
            >
              🎁 {settings.giftCategoryCtaText} — {active.title.toLowerCase()}
            </button>
          )}

          {channelsOpen && (
            <div className="mt-5 space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900">
                  Выберите удобный способ
                </h4>
                <p className="mt-1 text-xs text-muted">
                  Откроется общий каталог EcoNext — выберите товары из списка выше или
                  напишите, для кого нужен подарок.
                </p>
              </div>

              {links.max && (
                <TrackedLinkBtn
                  href={links.max}
                  label={buttons.catalogMaxButtonText || "Подобрать в MAX"}
                  eventType="click_catalog_max"
                  partnerId={partnerId}
                  variant="accent"
                  badge="Рекомендуем"
                  hint="Работает в России без VPN"
                />
              )}

              {(links.telegram || links.vk) && (
                <div className="grid grid-cols-2 gap-2">
                  {links.telegram && (
                    <TrackedLinkBtn
                      href={links.telegram}
                      label="Telegram"
                      eventType="click_catalog_telegram"
                      partnerId={partnerId}
                      variant="secondary"
                      compact
                    />
                  )}
                  {links.vk && (
                    <TrackedLinkBtn
                      href={links.vk}
                      label="VK"
                      eventType="click_catalog_vk"
                      partnerId={partnerId}
                      variant="secondary"
                      compact
                    />
                  )}
                </div>
              )}

              {links.website && (
                <TrackedLinkBtn
                  href={links.website}
                  label="🌐 Смотреть ассортимент на сайте"
                  eventType="click_catalog_website"
                  partnerId={partnerId}
                  variant="outline"
                  compact
                />
              )}

              {links.uds && (
                <TrackedLinkBtn
                  href={links.uds}
                  label={buttons.catalogUdsButtonText || "Открыть приложение EcoNext"}
                  eventType="click_catalog_uds"
                  partnerId={partnerId}
                  compact
                />
              )}

              {links.udsApp && (
                <TrackedLinkBtn
                  href={links.udsApp}
                  label={
                    buttons.catalogUdsAppButtonText ||
                    "Скачать приложение EcoNext"
                  }
                  eventType="click_catalog_uds_app"
                  partnerId={partnerId}
                  variant="outline"
                  compact
                />
              )}

              {!hasAnyLink && (
                <p className="rounded-xl border border-dashed border-gray-200 bg-surface p-4 text-center text-sm text-gray-600">
                  Позвоните нам — поможем подобрать подарок и оформить заказ.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
