import { describe, expect, it, vi } from "vitest";

vi.mock("next-intl/middleware", () => ({
  default: () => () => new Response(),
}));

const { config } = await import("@/proxy");
const { routing } = await import("@/i18n/routing");

function matches(pathname: string): boolean {
  const matchers = config.matcher as string[];
  return matchers.some((pattern) => {
    const re = new RegExp(
      "^" + pattern.replace(/\\\//g, "/").replace(/\(.*?\)/g, (m) => m) + "$"
    );
    return re.test(pathname);
  });
}

describe("proxy middleware matcher", () => {
  it("exposes a matcher config", () => {
    expect(Array.isArray(config.matcher)).toBe(true);
    expect(config.matcher.length).toBeGreaterThan(0);
  });

  it("matches the root path", () => {
    expect(matches("/")).toBe(true);
  });

  it("matches unprefixed localized paths so they redirect to the default locale", () => {
    expect(matches("/actions")).toBe(true);
    expect(matches("/help")).toBe(true);
    expect(matches("/team-building")).toBe(true);
    expect(matches("/docs/ai")).toBe(true);
  });

  it("matches already-localized paths", () => {
    expect(matches("/en/actions")).toBe(true);
    expect(matches("/fr/actions")).toBe(true);
    expect(matches("/en")).toBe(true);
  });

  it("does not match the API routes", () => {
    expect(matches("/api/leads")).toBe(false);
  });

  it("does not match Next internals", () => {
    expect(matches("/_next/static/chunk.js")).toBe(false);
    expect(matches("/_vercel/insights")).toBe(false);
  });

  it("does not match static files with an extension", () => {
    expect(matches("/favicon.ico")).toBe(false);
    expect(matches("/favicon/android-chrome-512x512.png")).toBe(false);
    expect(matches("/robots.txt")).toBe(false);
  });

  it("declares en as the default locale so /actions redirects to /en/actions", () => {
    expect(routing.defaultLocale).toBe("en");
    expect(routing.locales).toContain("en");
  });
});