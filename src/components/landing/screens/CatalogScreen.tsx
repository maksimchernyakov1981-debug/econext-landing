import { landingHomeHref } from "@/lib/landing-paths";
import { ContactFooter } from "../ContactFooter";
import { LandingScreenLayout } from "../LandingScreenLayout";
import { ScreenTracker } from "../ScreenTracker";
import { TrackedLinkBtn } from "../TrackedLinkBtn";
import type { LandingViewProps } from "../types";

export function CatalogScreen({
  data,
  partnerSlug,
  partnerId,
}: {
  data: LandingViewProps;
  partnerSlug: string | null;
  partnerId: number | null;
}) {
  return (
    <LandingScreenLayout
      title={data.catalog.title}
      backLabel={data.buttons.backButtonText}
      backHref={landingHomeHref(partnerSlug)}
    >
      <ScreenTracker eventType="click_catalog" partnerId={partnerId} />
      <p className="text-sm text-gray-700">{data.catalog.description}</p>
      {data.catalog.isActive ? (
        <div className="flex flex-col gap-4 mt-6">
          {data.catalog.telegramCatalogUrl && (
            <div className="space-y-2">
              <p className="text-xs text-muted">{data.catalog.telegramCatalogText}</p>
              <TrackedLinkBtn
                href={data.catalog.telegramCatalogUrl}
                label={data.buttons.catalogTelegramButtonText}
                eventType="click_catalog_telegram"
                partnerId={partnerId}
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
                partnerId={partnerId}
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
                partnerId={partnerId}
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
                partnerId={partnerId}
              />
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted mt-4">{data.catalog.description}</p>
      )}
      <ContactFooter data={data} />
    </LandingScreenLayout>
  );
}
