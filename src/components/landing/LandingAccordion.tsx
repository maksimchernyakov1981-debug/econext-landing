"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { resolveCatalogLinks } from "@/lib/catalog-links";
import { resolveDiscountLinks } from "@/lib/discount-links";
import { resolveMapLinks } from "@/lib/map-links";
import { trackEvent } from "./track";
import { landingHeroTexts } from "./landing-template";
import { ContactFooter } from "./ContactFooter";
import { DiscountBlock } from "./DiscountBlock";
import { MapRouteLinkBtn } from "./MapRouteLinkBtn";
import { TrackedLinkBtn } from "./TrackedLinkBtn";
import { telLink } from "@/lib/links";
import { resolveLocationMap } from "@/lib/map-embed";
import { LocationMapBlock } from "./LocationMapBlock";
import { StoreMediaBlock } from "./StoreMediaBlock";
import type { LandingViewProps } from "./types";

type Section = "catalog" | "media" | "route" | "schedule" | null;

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
  const [giftOpen, setGiftOpen] = useState(false);
  const giftRef = useRef<HTMLDivElement>(null);
  const p = data.partner;
  const pid = p?.id ?? null;

  const { heroTitle, heroSubtitle, heroDesc, partnerLine, ctx } = landingHeroTexts(data);

  const locationMap = resolveLocationMap(data.map);
  const maps = resolveMapLinks(data.workStatus.mapLinks, data.map, data.workStatus.address);

  const discountLinks = resolveDiscountLinks(p, data.contacts);
  const catalogLinks = resolveCatalogLinks(data.catalog, data.contacts);

  const toggle = (section: Section, eventType: string) => {
    const next = open === section ? null : section;
    setOpen(next);
    if (next) trackEvent(eventType, pid);
  };

  const toggleGift = () => {
    const next = !giftOpen;
    setGiftOpen(next);
    if (next) {
      trackEvent("click_gift_cta", pid);
      requestAnimationFrame(() => {
        giftRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  return (
    <div className="min-h-screen max-w-lg mx-auto px-4 pb-8">
      <header className="pt-6 pb-4 flex flex-col items-center gap-2">
        <Image
          src="/images/econext-logo.png"
          alt="EcoNext"
          width={88}
          height={88}
          className="rounded-full shadow-md ring-2 ring-cyan-200/80"
          priority
        />
        <div className="text-lg font-bold text-primary tracking-tight">EcoNext</div>
      </header>

      <section className="rounded-2xl bg-gradient-to-b from-amber-50 to-white border border-amber-100 p-5 mb-4">
        <h1 className="text-xl font-bold text-gray-900 whitespace-pre-line">{heroTitle}</h1>
        <p className="mt-2 text-gray-700">{heroSubtitle}</p>
        {partnerLine && <p className="mt-2 font-medium text-primary">{partnerLine}</p>}
        {heroDesc && <p className="mt-3 text-sm text-muted">{heroDesc}</p>}
        <div className="mt-4 space-y-1">
          <button
            type="button"
            onClick={toggleGift}
            aria-expanded={giftOpen}
            aria-controls="gift-instructions"
            className={`flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-base font-semibold transition ${
              giftOpen
                ? "bg-white text-primary border-2 border-primary/40"
                : "bg-accent text-gray-900 shadow-md shadow-amber-200/50 ring-2 ring-amber-300/60 hover:brightness-105"
            }`}
          >
            {giftOpen ? "Свернуть инструкцию" : data.buttons.discountButtonText || "🎁 Получить подарок"}
          </button>
          {!giftOpen && (
            <p className="text-xs text-center text-muted">
              Бесплатно при покупке от 1500 ₽ на точке
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl bg-surface border border-green-100 p-4 mb-4">
        <p className="font-semibold">{data.workStatus.title}</p>
        <p className="text-sm text-gray-700 mt-1">{data.workStatus.description}</p>
      </section>

      {giftOpen && (
        <div ref={giftRef}>
          <DiscountBlock
            data={data}
            partnerId={pid}
            udsUrl={discountLinks.uds}
            maxUrl={discountLinks.max}
            telegramUrl={discountLinks.telegram}
            ctx={ctx}
            address={data.workStatus.address}
            landmark={data.workStatus.landmark}
          />
        </div>
      )}

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

      <LocationMapBlock view={locationMap} title={data.landing.schemeBlockTitle} />

      <div className="flex flex-col gap-3 mb-2 mt-4">
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
              <p className="text-sm text-gray-600 bg-surface rounded-xl p-3 border border-green-100">
                Каталог временно недоступен. Позвоните нам — расскажем об ассортименте.
              </p>
            )}
            {data.catalog.isActive && (
              <>
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
                      variant="accent"
                      badge="Рекомендуем"
                      hint="Работает в России без VPN"
                    />
                  </div>
                )}
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
                      variant="secondary"
                      hint="Может понадобиться VPN"
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
                      variant="outline"
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
                      variant="outline"
                    />
                  </div>
                )}
                {!catalogLinks.telegram &&
                  !catalogLinks.max &&
                  !catalogLinks.website &&
                  !catalogLinks.uds &&
                  !catalogLinks.udsApp && (
                    <p className="text-sm text-center text-gray-600 bg-surface rounded-xl p-4 border border-dashed border-gray-200">
                      Каталог скоро появится. Позвоните нам — подскажем.
                    </p>
                  )}
              </>
            )}
          </div>
        )}

        {data.storeMedia.length > 0 && (
          <>
            <SectionToggle
              active={open === "media"}
              onClick={() => toggle("media", "click_media")}
              className="min-h-[48px] rounded-2xl border-2 border-gray-300 text-gray-900 font-semibold px-4 py-3 text-left"
            >
              {data.landing.storeMediaBlockTitle || "📸 Фото и видео точки"}
            </SectionToggle>
            {open === "media" && (
              <div className="rounded-2xl border border-gray-200 bg-white p-4 -mt-1 mb-2">
                <StoreMediaBlock
                  title={data.landing.storeMediaBlockTitle || "📸 Фото и видео точки"}
                  items={data.storeMedia}
                  embedded
                />
              </div>
            )}
          </>
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
              {maps.yandexMapsRoute && (
                <MapRouteLinkBtn
                  link={maps.yandexMapsRoute}
                  label={data.buttons.yandexMapsButtonText}
                  eventType="click_yandex_maps"
                  partnerId={pid}
                  useNativeApp
                />
              )}
              {maps.yandexNavigatorRoute && (
                <MapRouteLinkBtn
                  link={maps.yandexNavigatorRoute}
                  label={data.buttons.yandexNavigatorButtonText}
                  eventType="click_yandex_navigator"
                  partnerId={pid}
                  useNativeApp
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
                  variant="outline"
                />
              )}
              {!maps.yandexMapsRoute &&
                !maps.yandexNavigatorRoute &&
                !maps.twoGisUrl &&
                !maps.googleMapsUrl && (
                  <p className="text-sm text-center text-gray-600 bg-white rounded-xl p-4 border border-dashed border-gray-200">
                    Маршрут в навигатор скоро будет доступен. Позвоните — подскажем дорогу.
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
