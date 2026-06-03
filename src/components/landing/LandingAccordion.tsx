"use client";

import { useState } from "react";
import Image from "next/image";
import { replaceTemplateVars } from "@/lib/templates";
import { resolveLink } from "@/lib/links";
import { trackEvent } from "./track";
import { landingHeroTexts } from "./landing-template";
import { ContactFooter } from "./ContactFooter";
import { TrackedLinkBtn } from "./TrackedLinkBtn";
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
  const maps = data.workStatus.mapLinks;

  const udsDiscount = resolveLink(p?.udsLink, data.contacts.udsUrl);
  const tgDiscount = resolveLink(p?.telegramBotLink, data.contacts.telegramBotUrl);
  const maxDiscount = resolveLink(p?.maxBotLink, data.contacts.maxBotUrl);

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
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src={schemeUrl}
              alt={schemeCaption ?? ""}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          {schemeCaption && (
            <p className="text-sm text-muted mt-2 text-center">{schemeCaption}</p>
          )}
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
        {open === "catalog" && data.catalog.isActive && (
          <div className="rounded-2xl border border-green-100 bg-white p-4 space-y-4 -mt-1 mb-2">
            <h3 className="font-semibold">{data.catalog.title}</h3>
            <p className="text-sm text-gray-700">{data.catalog.description}</p>
            {data.catalog.telegramCatalogUrl && (
              <div className="space-y-2">
                <p className="text-xs text-muted">{data.catalog.telegramCatalogText}</p>
                <TrackedLinkBtn
                  href={data.catalog.telegramCatalogUrl}
                  label={data.buttons.catalogTelegramButtonText}
                  eventType="click_catalog_telegram"
                  partnerId={pid}
                />
              </div>
            )}
            {data.catalog.maxCatalogUrl && (
              <div className="space-y-2">
                <p className="text-xs text-muted">{data.catalog.maxCatalogText}</p>
                <TrackedLinkBtn
                  href={data.catalog.maxCatalogUrl}
                  label={data.buttons.catalogMaxButtonText}
                  eventType="click_catalog_max"
                  partnerId={pid}
                />
              </div>
            )}
            {data.catalog.udsCatalogUrl && (
              <div className="space-y-2">
                <p className="text-xs text-muted">{data.catalog.udsCatalogText}</p>
                <TrackedLinkBtn
                  href={data.catalog.udsCatalogUrl}
                  label={data.buttons.catalogUdsButtonText}
                  eventType="click_catalog_uds"
                  partnerId={pid}
                />
              </div>
            )}
            {(data.catalog.udsAppDownloadUrl || data.contacts.udsAppDownloadUrl) && (
              <div className="space-y-2">
                <p className="text-xs text-muted">{data.catalog.udsAppText}</p>
                <TrackedLinkBtn
                  href={
                    data.catalog.udsAppDownloadUrl ||
                    data.contacts.udsAppDownloadUrl!
                  }
                  label={data.buttons.catalogUdsAppButtonText}
                  eventType="click_catalog_uds_app"
                  partnerId={pid}
                />
              </div>
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
