import Image from "next/image";
import { landingHomeHref } from "@/lib/landing-paths";
import { ContactFooter } from "../ContactFooter";
import { LandingScreenLayout } from "../LandingScreenLayout";
import { ScreenTracker } from "../ScreenTracker";
import { TrackedLinkBtn } from "../TrackedLinkBtn";
import type { LandingViewProps } from "../types";

export function RouteScreen({
  data,
  partnerSlug,
  partnerId,
}: {
  data: LandingViewProps;
  partnerSlug: string | null;
  partnerId: number | null;
}) {
  const maps = data.workStatus.mapLinks;
  const schemeUrl = data.workStatus.schemeImageUrl;
  const schemeCaption =
    data.workStatus.schemeCaption || data.landing.schemeDefaultCaption;

  return (
    <LandingScreenLayout
      title={data.landing.routeBlockTitle}
      backLabel={data.buttons.backButtonText}
      backHref={landingHomeHref(partnerSlug)}
    >
      <ScreenTracker eventType="click_route" partnerId={partnerId} />
      <p className="text-sm text-gray-700">{data.landing.routeBlockDescription}</p>
      <div className="mt-4 rounded-2xl bg-surface border border-green-100 p-4 space-y-2">
        <p className="text-sm font-medium">{data.workStatus.address}</p>
        {data.workStatus.landmark && (
          <p className="text-sm text-muted">{data.workStatus.landmark}</p>
        )}
      </div>
      {schemeUrl && (
        <section className="mt-6">
          {data.landing.schemeBlockTitle && (
            <h2 className="font-semibold mb-2 text-sm">{data.landing.schemeBlockTitle}</h2>
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
      <div className="flex flex-col gap-3 mt-6">
        {maps.yandexMapsUrl && (
          <TrackedLinkBtn
            href={maps.yandexMapsUrl}
            label={data.buttons.yandexMapsButtonText}
            eventType="click_yandex_maps"
            partnerId={partnerId}
          />
        )}
        {maps.yandexNavigatorUrl && (
          <TrackedLinkBtn
            href={maps.yandexNavigatorUrl}
            label={data.buttons.yandexNavigatorButtonText}
            eventType="click_yandex_navigator"
            partnerId={partnerId}
          />
        )}
        {maps.twoGisUrl && (
          <TrackedLinkBtn
            href={maps.twoGisUrl}
            label={data.buttons.twoGisButtonText}
            eventType="click_2gis"
            partnerId={partnerId}
          />
        )}
        {maps.googleMapsUrl && (
          <TrackedLinkBtn
            href={maps.googleMapsUrl}
            label={data.buttons.googleMapsButtonText}
            eventType="click_google_maps"
            partnerId={partnerId}
          />
        )}
      </div>
      <ContactFooter data={data} />
    </LandingScreenLayout>
  );
}
