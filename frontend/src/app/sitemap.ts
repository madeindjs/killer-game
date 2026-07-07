import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { LOCALIZED_PATHS, SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const path of LOCALIZED_PATHS) {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      languages[locale] = [SITE_URL, locale, path].filter(Boolean).join("/");
    }
    languages["x-default"] =
      [SITE_URL, routing.defaultLocale, path].filter(Boolean).join("/");
    const lastModified = new Date();
    for (const locale of routing.locales) {
      const url = [SITE_URL, locale, path].filter(Boolean).join("/");
      entries.push({
        url,
        lastModified,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
        alternates: { languages },
      });
    }
  }
  return entries;
}