"use client";

import { useState } from "react";
import Image from "next/image";
import { replaceTemplateVars } from "@/lib/templates";
import { resolveLink, telLink } from "@/lib/links";
import { trackEvent } from "./track";
import type { LandingViewProps } from "./types";

function LinkBtn({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className="flex min-h-[48px] items-center justify-center rounded-2xl bg-primary text-white font-medium text-base px-4 py-3 w-full"
    >
      {label}
    </a>
  );
}

export function LandingView({ data }: { data: LandingViewProps }) {
  const [openDiscount, setOpenDiscount] = useState(false);
  const [openCatalog, setOpenCatalog] = useState(false);
  const [openRoute, setOpenRoute] = useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);

  const p = data.partner;
  const pid = p?.id ?? null;

  const ctx = {
    partner_name: p?.name ?? "",
    store_name: data.map.storeName,
    address: data.workStatus.address,
    landmark: data.workStatus.landmark ?? "",
    today_schedule: data.workStatus.todaySchedule,
    work_status: data.workStatus.title,
  };

  const heroTitle = replaceTemplateVars(
    p?.customHeroTitle || data.landing.heroTitle,
    ctx
  );
  const heroSubtitle = replaceTemplateVars(
    p?.customHeroSubtitle || data.landing.heroSubtitle,
    ctx
  );
  const heroDesc = replaceTemplateVars(
    p?.customHeroDescription || data.landing.heroDescription,
    ctx
  );
  const partnerLine = p
    ? replaceTemplateVars(data.landing.partnerLineTemplate, ctx)
    : null;

  const udsDiscount = resolveLink(p?.udsLink, data.contacts.udsUrl);
  const tgDiscount = resolveLink(p?.telegramBotLink, data.contacts.telegramBotUrl);
  const maxDiscount = resolveLink(p?.maxBotLink, data.contacts.maxBotUrl);

  const schemeUrl = data.workStatus.schemeImageUrl;
  const schemeCaption =
    data.workStatus.schemeCaption || data.landing.schemeDefaultCaption;

  const maps = data.workStatus.mapLinks;

  const toggleDiscount = () => {
    const next = !openDiscount;
    setOpenDiscount(next);
    if (next) trackEvent("click_discount", pid);
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

      <div className="flex flex-col gap-3 mb-4">
        <button
          type="button"
          onClick={toggleDiscount}
          className="min-h-[48px] rounded-2xl bg-accent text-gray-900 font-semibold px-4 py-3"
        >
          {data.buttons.discountButtonText}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpenCatalog(!openCatalog);
            if (!openCatalog) trackEvent("click_catalog", pid);
          }}
          className="min-h-[48px] rounded-2xl bg-primary text-white font-semibold px-4 py-3"
        >
          {data.buttons.catalogButtonText}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpenRoute(!openRoute);
            if (!openRoute) trackEvent("click_route", pid);
          }}
          className="min-h-[48px] rounded-2xl border-2 border-primary text-primary font-semibold px-4 py-3"
        >
          {data.buttons.routeButtonText}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpenSchedule(!openSchedule);
            if (!openSchedule) trackEvent("click_schedule", pid);
          }}
          className="min-h-[48px] rounded-2xl border border-gray-200 font-semibold px-4 py-3"
        >
          {data.buttons.scheduleButtonText}
        </button>
      </div>

      {openDiscount && (
        <div className="mb-4 rounded-2xl border border-green-100 bg-surface p-4 space-y-3">
          <h3 className="font-semibold">{data.landing.discountBlockTitle}</h3>
          <p className="text-sm">
            {replaceTemplateVars(
              p?.customGiftText || data.landing.discountBlockDescription,
              ctx
            )}
          </p>
          <div className="flex flex-col gap-2">
            {udsDiscount && (
              <LinkBtn
                href={udsDiscount}
                label={data.buttons.udsButtonText}
                onClick={() => trackEvent("click_uds", pid)}
              />
            )}
            {tgDiscount && (
              <LinkBtn
                href={tgDiscount}
                label={data.buttons.telegramButtonText}
                onClick={() => trackEvent("click_telegram", pid)}
              />
            )}
            {maxDiscount && (
              <LinkBtn
                href={maxDiscount}
                label={data.buttons.maxButtonText}
                onClick={() => trackEvent("click_max", pid)}
              />
            )}
          </div>
          <p className="text-xs text-muted">{data.landing.discountHint}</p>
        </div>
      )}

      {openCatalog && data.catalog.isActive && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">{data.catalog.title}</h3>
          <p className="text-sm mb-3">{data.catalog.description}</p>
          <div className="flex flex-col gap-2">
            {data.catalog.telegramCatalogUrl && (
              <>
                <p className="text-xs text-muted">{data.catalog.telegramCatalogText}</p>
                <LinkBtn
                  href={data.catalog.telegramCatalogUrl}
                  label={data.buttons.catalogTelegramButtonText}
                  onClick={() => trackEvent("click_catalog_telegram", pid)}
                />
              </>
            )}
            {data.catalog.maxCatalogUrl && (
              <>
                <p className="text-xs text-muted">{data.catalog.maxCatalogText}</p>
                <LinkBtn
                  href={data.catalog.maxCatalogUrl}
                  label={data.buttons.catalogMaxButtonText}
                  onClick={() => trackEvent("click_catalog_max", pid)}
                />
              </>
            )}
            {data.catalog.udsCatalogUrl && (
              <>
                <p className="text-xs text-muted">{data.catalog.udsCatalogText}</p>
                <LinkBtn
                  href={data.catalog.udsCatalogUrl}
                  label={data.buttons.catalogUdsButtonText}
                  onClick={() => trackEvent("click_catalog_uds", pid)}
                />
              </>
            )}
            {(data.catalog.udsAppDownloadUrl || data.contacts.udsAppDownloadUrl) && (
              <>
                <p className="text-xs text-muted">{data.catalog.udsAppText}</p>
                <LinkBtn
                  href={
                    data.catalog.udsAppDownloadUrl ||
                    data.contacts.udsAppDownloadUrl!
                  }
                  label={data.buttons.catalogUdsAppButtonText}
                  onClick={() => trackEvent("click_catalog_uds_app", pid)}
                />
              </>
            )}
          </div>
        </div>
      )}

      {openRoute && (
        <div className="mb-4 space-y-2">
          <h3 className="font-semibold">{data.landing.routeBlockTitle}</h3>
          <p className="text-sm">{data.landing.routeBlockDescription}</p>
          <p className="text-sm">{data.workStatus.address}</p>
          {data.workStatus.landmark && (
            <p className="text-sm text-muted">{data.workStatus.landmark}</p>
          )}
          <div className="flex flex-col gap-2 mt-2">
            {maps.yandexMapsUrl && (
              <LinkBtn
                href={maps.yandexMapsUrl}
                label={data.buttons.yandexMapsButtonText}
                onClick={() => trackEvent("click_yandex_maps", pid)}
              />
            )}
            {maps.yandexNavigatorUrl && (
              <LinkBtn
                href={maps.yandexNavigatorUrl}
                label={data.buttons.yandexNavigatorButtonText}
                onClick={() => trackEvent("click_yandex_navigator", pid)}
              />
            )}
            {maps.twoGisUrl && (
              <LinkBtn
                href={maps.twoGisUrl}
                label={data.buttons.twoGisButtonText}
                onClick={() => trackEvent("click_2gis", pid)}
              />
            )}
            {maps.googleMapsUrl && (
              <LinkBtn
                href={maps.googleMapsUrl}
                label={data.buttons.googleMapsButtonText}
                onClick={() => trackEvent("click_google_maps", pid)}
              />
            )}
          </div>
        </div>
      )}

      {openSchedule && (
        <div className="mb-4">
          <h3 className="font-semibold">{data.landing.scheduleBlockTitle}</h3>
          {data.specialDay?.description && (
            <p className="text-sm mt-2 font-medium text-amber-800">
              Важно на сегодня: {data.specialDay.description}
            </p>
          )}
          <pre className="text-sm mt-3 whitespace-pre-wrap font-sans">
            {data.fullScheduleText}
          </pre>
        </div>
      )}

      <footer className="text-xs text-center text-muted mt-8">
        {data.landing.privacyFooterText}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {resolveLink(p?.telegramChannelLink, data.contacts.telegramChannelUrl) && (
            <a
              className="text-primary underline"
              href={
                resolveLink(
                  p?.telegramChannelLink,
                  data.contacts.telegramChannelUrl
                )!
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {data.contacts.telegramChannelButtonText}
            </a>
          )}
          {resolveLink(p?.maxChannelLink, data.contacts.maxChannelUrl) && (
            <a
              className="text-primary underline"
              href={resolveLink(p?.maxChannelLink, data.contacts.maxChannelUrl)!}
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
    </div>
  );
}
