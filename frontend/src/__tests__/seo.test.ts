import { describe, expect, it } from "vitest";
import {
  SITE_URL,
  LOCALIZED_PATHS,
  NOINDEX_PATHS,
  absoluteUrl,
  buildAlternates,
} from "@/lib/seo";
import { routing } from "@/i18n/routing";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

describe("seo config", () => {
  it("exposes a canonical production URL without trailing slash", () => {
    expect(SITE_URL).toMatch(/^https:\/\/the-killer\.online$/);
    expect(SITE_URL.endsWith("/")).toBe(false);
  });

  it("lists every localized page that should be in the sitemap", () => {
    expect(LOCALIZED_PATHS).toContain("");
    expect(LOCALIZED_PATHS).toContain("actions");
    expect(LOCALIZED_PATHS).toContain("help");
    expect(LOCALIZED_PATHS).toContain("team-building");
    expect(LOCALIZED_PATHS).toContain("docs/ai");
  });

  it("excludes the private /games UI from the sitemap", () => {
    expect(LOCALIZED_PATHS).not.toContain("games");
    expect(NOINDEX_PATHS).toContain("games");
  });
});

describe("absoluteUrl", () => {
  it("builds a root URL for each locale", () => {
    expect(absoluteUrl("en")).toBe("https://the-killer.online/en");
    expect(absoluteUrl("fr")).toBe("https://the-killer.online/fr");
  });

  it("builds a nested URL for a localized path", () => {
    expect(absoluteUrl("fr", "actions")).toBe(
      "https://the-killer.online/fr/actions"
    );
  });
});

describe("buildAlternates", () => {
  it("returns a canonical URL pointing to the default locale", () => {
    const { alternates } = buildAlternates("actions");
    expect(alternates?.canonical).toBe(
      "https://the-killer.online/en/actions"
    );
  });

  it("returns hreflang entries for every locale plus x-default", () => {
    const { alternates } = buildAlternates("help");
    const languages = alternates?.languages ?? {};
    for (const locale of routing.locales) {
      expect(languages[locale]).toBe(absoluteUrl(locale, "help"));
    }
    expect(languages["x-default"]).toBe(absoluteUrl(routing.defaultLocale, "help"));
  });
});

describe("sitemap", () => {
  const entries = sitemap();

  it("emits one entry per locale per localized path", () => {
    const urls = entries.map((e) => e.url).sort();
    expect(urls).toContain("https://the-killer.online/en");
    expect(urls).toContain("https://the-killer.online/fr");
    expect(urls).toContain("https://the-killer.online/en/actions");
    expect(urls).toContain("https://the-killer.online/fr/actions");
    expect(urls).toContain("https://the-killer.online/en/help");
    expect(urls).toContain("https://the-killer.online/fr/help");
  });

  it("does not include the private /games routes", () => {
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.includes("/games"))).toBe(false);
  });

  it("provides hreflang alternates on each entry", () => {
    const home = entries.find((e) => e.url === "https://the-killer.online/en");
    expect(home?.alternates?.languages?.en).toBe(
      "https://the-killer.online/en"
    );
    expect(home?.alternates?.languages?.fr).toBe(
      "https://the-killer.online/fr"
    );
    expect(home?.alternates?.languages?.["x-default"]).toBe(
      "https://the-killer.online/en"
    );
  });

  it("gives the homepage the highest priority", () => {
    const home = entries.find((e) => e.url === "https://the-killer.online/en");
    expect(home?.priority).toBe(1);
  });
});

describe("robots", () => {
  const rules = robots();
  const rule = Array.isArray(rules.rules) ? rules.rules[0] : rules.rules;

  it("allows crawling of public pages", () => {
    expect(rule.userAgent).toBe("*");
    expect(rule.allow).toBe("/");
  });

  it("disallows the private games UI and the API", () => {
    expect(rule.disallow).toContain("/en/games/");
    expect(rule.disallow).toContain("/fr/games/");
    expect(rule.disallow).toContain("/api/");
  });

  it("declares the sitemap URL", () => {
    expect(rules.sitemap).toBe("https://the-killer.online/sitemap.xml");
  });
});