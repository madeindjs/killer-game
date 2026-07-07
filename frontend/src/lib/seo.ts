import type { Metadata } from "next";

import { routing } from "@/i18n/routing";

/**
 * Canonical production origin. Used as the Next.js {@link Metadata.metadataBase}
 * so relative URLs (OG images, canonical, alternates) resolve to absolute URLs.
 *
 * Override locally with `NEXT_PUBLIC_SITE_URL` (e.g. for preview deployments).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://the-killer.online"
).replace(/\/$/, "");

export const SITE_NAME = "The Killer Game";

/** Path segments that exist for every locale (i.e. localized pages). */
export const LOCALIZED_PATHS: readonly string[] = [
  "",
  "actions",
  "help",
  "team-building",
  "docs/ai",
];

/** Paths excluded from the sitemap (e.g. noindex'd private app UI). */
export const NOINDEX_PATHS: readonly string[] = ["games"];

/** Builds an absolute URL for a given locale + path. */
export function absoluteUrl(locale: string, path = ""): string {
  const segments = [SITE_URL, locale, path].filter(Boolean);
  return segments.join("/");
}

/**
 * Generates `alternates.languages` (hreflang) for a localized page.
 *
 * Both locales always point to their prefixed URL (e.g. `/fr/actions`,
 * `/en/actions`) with an `x-default` entry pointing to the default locale.
 * Explicit per-locale hreflang is more reliable for Google than `as-needed`
 * and avoids the www-vs-non-www ambiguity reported in issue #48.
 */
export function buildAlternates(
  path = ""
): Pick<Metadata, "alternates"> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(locale, path);
  }
  languages["x-default"] = absoluteUrl(routing.defaultLocale, path);
  const canonical = languages[routing.defaultLocale];
  return { alternates: { canonical, languages } };
}

/** Shared OpenGraph defaults; pages can spread this and override fields. */
export const OPEN_GRAPH_DEFAULTS = {
  siteName: SITE_NAME,
  type: "website" as const,
  images: [
    {
      url: "/favicon/android-chrome-512x512.png",
      width: 512,
      height: 512,
      alt: SITE_NAME,
    },
  ],
};

export const TWITTER_DEFAULTS = {
  card: "summary" as const,
};