import type { Metadata } from "next";
import { getPublicSiteUrl } from "./public-site-url";

const OG_DESCRIPTION =
  "Подарок от 1500 ₽ на точке EcoNext. Скидки дома в приложении, Telegram, MAX и VK.";

export function getSiteUrl(): string {
  return getPublicSiteUrl();
}

export function buildSiteMetadata(): Metadata {
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "EcoNext",
      template: "%s | EcoNext",
    },
    description: OG_DESCRIPTION,
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: siteUrl,
      siteName: "EcoNext",
      title: "EcoNext — полотенца, подарки и бонусы",
      description: OG_DESCRIPTION,
      images: [
        {
          url: "/images/econext-logo.png",
          width: 512,
          height: 512,
          alt: "EcoNext",
        },
      ],
    },
    twitter: {
      card: "summary",
      title: "EcoNext",
      description: OG_DESCRIPTION,
      images: ["/images/econext-logo.png"],
    },
    icons: {
      icon: "/images/econext-logo.png",
      apple: "/images/econext-logo.png",
    },
  };
}
