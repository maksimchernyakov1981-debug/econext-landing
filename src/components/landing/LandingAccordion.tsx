"use client";

import { useState } from "react";
import { replaceTemplateVars } from "@/lib/templates";
import { resolveCatalogLinks } from "@/lib/catalog-links";
import { resolveDiscountLinks } from "@/lib/discount-links";
import { resolveMapLinks } from "@/lib/map-links";
import { trackEvent } from "./track";
import { landingHeroTexts } from "./landing-template";
import { ContactFooter } from "./ContactFooter";
import { TrackedLinkBtn } from "./TrackedLinkBtn";
import { ZoomableImage } from "./ZoomableImage";
import { telLink } from "@/lib/links";
import type { LandingViewProps } from "./types";

type Section = "discount" | "catalog" | "route" | "schedule" | null;

function SectionToggle({
  active,
  onClick,
  className,
  children,
}: {
  active: boolean;
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} className={className} aria-expanded={active}>
      {children}
    </button>
  );
}

export function LandingAccordion({ data }: { data: LandingViewProps }) {
  const [open, setOpen] = useState<Section>(null);
  const p = data.partner;
  const pid = p?.id ?? null;

  const { heroTitle, heroSubtitle, heroDesc, partnerLine, ctx } = landingHeroTexts(data);

  const schemeUrl = data.workStatus.schemeImageUrl;
  const schemeCaption =
    data.workStatus.schemeCaption || data.landing.schemeDefaultCaption;
  const maps = resolveMapLinks(data.workStatus.mapLinks, data.map);

  const discountLinks = resolveDiscountLinks(p, data.contacts);
  const udsDiscount = discountLinks.uds;
  const tgDiscount = discountLinks.telegram;
  const maxDiscount = discountLinks.max;

  const catalogLinks = resolveCatalogLinks(data.catalog, data.contacts);

  const toggle = (section: Section, eventType: string) => {
    const next = open === section ? null : section;
    setOpen(next);
    if (next) trackEvent(eventType, pid);
  };

  return (
    <div className="min-h-screen max-w-lg mx-auto px-4 pb-8">
      <header className="pt-6 pb-4 text-center">
        <div className="text-2xl font-bold text-primary">EcoNext</div>
      </header>

      <section className="rounded-2xl bg-gradient-to-b from-amber-50 to-white border border-amber-100 p-5 mb-4">
        <h1 className="text-xl font-bold text-gray-900 whitespace-pre-line">{heroTitle}</h1>
        <p className="mt-2 text-gray-700">{heroSubtitle}</p>
        {partnerLine && (
          <p className="mt-2 font-medium text-primary">{partnerLine}</p>
        )}
        <p className="mt-3 text-sm text-muted">{heroDesc}</p>
      </section>

      <section className="rounded-2xl bg-surface border border-green-100 p-4 mb-4">
        <p className="font-semibold">{data.workStatus.title}</p>
        <p className="text-sm text-gray-700 mt-1">{data.workStatus.description}</p>
      </section>

      {telLink(data.contacts.phone) && (
        <section className="rounded-2xl bg-primary/10 border border-primary/30 p-4 mb-4 text-center">
          <p className="text-sm text-gray-800 mb-3">
            {data.landing.callPromptText ||
              "По любым вопросам звоните — мы на связи и с радостью подскажем."}
          </p>
          <a
            href={telLink(data.contacts.phone)!}
            className="inline-flex min-h-[48px] items-center justify-center w-full rounded-2xl bg-primary text-white font-semibold px-4"
            onClick={() => trackEvent("click_call", pid)}
          >
            {data.landing.callButtonText ||
              data.contacts.contactButtonText ||
              `📞 Позвонить ${data.contacts.phone}`}
          </a>
        </section>
      )}

      <section className="mb-4">
        <h2 className="font-semibold mb-2">{data.landing.addressBlockTitle}</h2>
        <p className="text-sm">
          <span className="text-muted">{data.landing.addressLabel}: </span>
          {data.workStatus.address}
        </p>
        {data.workStatus.landmark && (
          <p className="text-sm mt-1">
            <span className="text-muted">{data.landing.landmarkLabel}: </span>
            {data.workStatus.landmark}
          </p>
        )}
      </section>

      {schemeUrl && (
        <section className="mb-4">
          {data.landing.schemeBlockTitle && (
            <h2 className="font-semibold mb-2">{data.landing.schemeBlockTitle}</h2>
          )}
          <ZoomableImage
            src={schemeUrl}
            alt={schemeCaption ?? "Схема прохода"}
            caption={schemeCaption}
          />
        </section>
      )}

      <div className="flex flex-col gap-3 mb-2">
        <SectionToggle
          active={open === "discount"}
          onClick={() => toggle("discount", "click_discount")}
          className="min-h-[48px] rounded-2xl bg-accent text-gray-900 font-semibold px-4 py-3 text-left"
        >
          {data.buttons.discountButtonText}
        </SectionToggle>
        {open === "discount" && (
          <div className="rounded-2xl border border-green-100 bg-surface p-4 space-y-3 -mt-1 mb-2">
            <h3 className="font-semibold">{data.landing.discountBlockTitle}</h3>
            <p className="text-sm text-gray-700">
              {replaceTemplateVars(
                p?.customGiftText || data.landing.discountBlockDescription,
                ctx
              )}
            </p>
            <div className="flex flex-col gap-2">
              {udsDiscount && (
                <TrackedLinkBtn
                  href={udsDiscount}
                  label={data.buttons.udsButtonText}
                  eventType="click_uds"
                  partnerId={pid}
                />
              )}
              {tgDiscount && (
                <TrackedLinkBtn
                  href={tgDiscount}
                  label={data.buttons.telegramButtonText}
                  eventType="click_telegram"
                  partnerId={pid}
                />
              )}
              {maxDiscount && (
                <TrackedLinkBtn
                  href={maxDiscount}
                  label={data.buttons.maxButtonText}
                  eventType="click_max"
                  partnerId={pid}
                />
              )}
              {!udsDiscount && !tgDiscount && !maxDiscount && (
                <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl p-3">
                  Кнопки не настроены. Админка → Контакты (общие ссылки) или Партнёры
                  (ссылки гостиницы). Сохраните с https:// или t.me/… и нажмите
                  «Применить на сайте».
                </p>
              )}
            </div>
            <p className="text-xs text-muted">{data.landing.discountHint}</p>
          </div>
        )}

        <SectionToggle
          active={open === "catalog"}
          onClick={() => toggle("catalog", "click_catalog")}
          className="min-h-[48px] rounded-2xl bg-primary text-white font-semibold px-4 py-3 text-left"
        >
          {data.buttons.catalogButtonText}
        </SectionToggle>
        {open === "catalog" && (
          <div className="rounded-2xl border border-green-100 bg-white p-4 space-y-4 -mt-1 mb-2">
            <h3 className="font-semibold">{data.catalog.title}</h3>
            <p className="text-sm text-gray-700">{data.catalog.description}</p>
            {!data.catalog.isActive && (
              <p className="text-sm text-amber-800">Блок выключен в админке → Ассортимент → «Активен».</p>
            )}
            {data.catalog.isActive && (
              <>
                {catalogLinks.telegram && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted">
                      {data.catalog.telegramCatalogText || "Telegram-бот EcoNext"}
                    </p>
                    <TrackedLinkBtn
                      href={catalogLinks.telegram}
                      label={data.buttons.catalogTelegramButtonText}
                      eventType="click_catalog_telegram"
                      partnerId={pid}
                    />
                  </div>
                )}
                {catalogLinks.max && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted">
                      {data.catalog.maxCatalogText || "MAX-бот EcoNext"}
                    </p>
                    <TrackedLinkBtn
                      href={catalogLinks.max}
                      label={data.buttons.catalogMaxButtonText}
                      eventType="click_catalog_max"
                      partnerId={pid}
                    />
                  </div>
                )}
                {catalogLinks.website && (
                  <div className="space-y-2">
                    <TrackedLinkBtn
                      href={catalogLinks.website}
                      label={data.contacts.websiteButtonText || "🌐 Сайт EcoNext"}
                      eventType="click_catalog_website"
                      partnerId={pid}
                    />
                  </div>
                )}
                {catalogLinks.uds && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted">
                      {data.catalog.udsCatalogText || "Каталог в UDS"}
                    </p>
                    <TrackedLinkBtn
                      href={catalogLinks.uds}
                      label={data.buttons.catalogUdsButtonText}
                      eventType="click_catalog_uds"
                      partnerId={pid}
                    />
                  </div>
                )}
                {catalogLinks.udsApp && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted">{data.catalog.udsAppText}</p>
                    <TrackedLinkBtn
                      href={catalogLinks.udsApp}
                      label={data.buttons.catalogUdsAppButtonText}
                      eventType="click_catalog_uds_app"
                      partnerId={pid}
                    />
                  </div>
                )}
                {!catalogLinks.telegram &&
                  !catalogLinks.max &&
                  !catalogLinks.website &&
                  !catalogLinks.uds &&
                  !catalogLinks.udsApp && (
                    <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl p-3">
                      Ссылки не заданы. Админка → Ассортимент или Контакты (Telegram, MAX,
                      сайт).
                    </p>
                  )}
              </>
            )}
          </div>
        )}

        <SectionToggle
          active={open === "route"}
          onClick={() => toggle("route", "click_route")}
          className="min-h-[48px] rounded-2xl border-2 border-primary text-primary font-semibold px-4 py-3 text-left"
        >
          {data.buttons.routeButtonText}
        </SectionToggle>
        {open === "route" && (
          <div className="rounded-2xl border border-green-100 bg-surface p-4 space-y-3 -mt-1 mb-2">
            <h3 className="font-semibold">{data.landing.routeBlockTitle}</h3>
            <p className="text-sm">{data.landing.routeBlockDescription}</p>
            <p className="text-sm font-medium">{data.workStatus.address}</p>
            {data.workStatus.landmark && (
              <p className="text-sm text-muted">{data.workStatus.landmark}</p>
            )}
            <div className="flex flex-col gap-2 mt-2">
              {maps.yandexMapsUrl && (
                <TrackedLinkBtn
                  href={maps.yandexMapsUrl}
                  label={data.buttons.yandexMapsButtonText}
                  eventType="click_yandex_maps"
                  partnerId={pid}
                />
              )}
              {maps.yandexNavigatorUrl && (
                <TrackedLinkBtn
                  href={maps.yandexNavigatorUrl}
                  label={data.buttons.yandexNavigatorButtonText}
                  eventType="click_yandex_navigator"
                  partnerId={pid}
                />
              )}
              {maps.twoGisUrl && (
                <TrackedLinkBtn
                  href={maps.twoGisUrl}
                  label={data.buttons.twoGisButtonText}
                  eventType="click_2gis"
                  partnerId={pid}
                />
              )}
              {maps.googleMapsUrl && (
                <TrackedLinkBtn
                  href={maps.googleMapsUrl}
                  label={data.buttons.googleMapsButtonText}
                  eventType="click_google_maps"
                  partnerId={pid}
                />
              )}
              {!maps.yandexMapsUrl &&
                !maps.yandexNavigatorUrl &&
                !maps.twoGisUrl &&
                !maps.googleMapsUrl && (
                  <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl p-3">
                    Кнопки карт не настроены. Админка → Карты и схема (ссылки Яндекс, 2ГИС…).
                  </p>
                )}
            </div>
          </div>
        )}

        <SectionToggle
          active={open === "schedule"}
          onClick={() => toggle("schedule", "click_schedule")}
          className="min-h-[48px] rounded-2xl border border-gray-200 font-semibold px-4 py-3 text-left"
        >
          {data.buttons.scheduleButtonText}
        </SectionToggle>
        {open === "schedule" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 -mt-1 mb-2">
            <h3 className="font-semibold">{data.landing.scheduleBlockTitle}</h3>
            {data.specialDay?.description && (
              <p className="text-sm font-medium text-amber-800 rounded-xl bg-amber-50 border border-amber-100 p-3 mt-3">
                {data.landing.scheduleSpecialDayPrefix} {data.specialDay.description}
              </p>
            )}
            <pre className="text-sm mt-3 whitespace-pre-wrap font-sans leading-relaxed">
              {data.fullScheduleText}
            </pre>
          </div>
        )}
      </div>

      <ContactFooter data={data} />
    </div>
  );
}
