import type { SiteSettings } from "@prisma/client";

export const defaultSiteSettings = (): Omit<SiteSettings, "createdAt" | "updatedAt"> => ({
  id: 1,
  publicSiteUrl: null,
});
