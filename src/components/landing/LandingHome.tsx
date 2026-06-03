import Image from "next/image";
import Link from "next/link";
import { landingSectionHref } from "@/lib/landing-paths";
import { landingHeroTexts } from "./landing-template";
import { ContactFooter } from "./ContactFooter";
import type { LandingViewProps } from "./types";

export function LandingHome({
  data,
  partnerSlug,
}: {
  data: LandingViewProps;
  partnerSlug: string | null;
}) {
  const { heroTitle, heroSubtitle, heroDesc, partnerLine } = landingHeroTexts(data);
  const schemeUrl = data.workStatus.schemeImageUrl;
  const schemeCaption =
    data.workStatus.schemeCaption || data.landing.schemeDefaultCaption;

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
        <Link
          href={landingSectionHref(partnerSlug, "discount")}
          className="min-h-[48px] rounded-2xl bg-accent text-gray-900 font-semibold px-4 py-3 flex items-center justify-center"
        >
          {data.buttons.discountButtonText}
        </Link>
        <Link
          href={landingSectionHref(partnerSlug, "catalog")}
          className="min-h-[48px] rounded-2xl bg-primary text-white font-semibold px-4 py-3 flex items-center justify-center"
        >
          {data.buttons.catalogButtonText}
        </Link>
        <Link
          href={landingSectionHref(partnerSlug, "route")}
          className="min-h-[48px] rounded-2xl border-2 border-primary text-primary font-semibold px-4 py-3 flex items-center justify-center"
        >
          {data.buttons.routeButtonText}
        </Link>
        <Link
          href={landingSectionHref(partnerSlug, "schedule")}
          className="min-h-[48px] rounded-2xl border border-gray-200 font-semibold px-4 py-3 flex items-center justify-center"
        >
          {data.buttons.scheduleButtonText}
        </Link>
      </div>

      <ContactFooter data={data} />
    </div>
  );
}
