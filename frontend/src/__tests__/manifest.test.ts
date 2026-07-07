import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("PWA web app manifest", () => {
  it("serves a valid manifest.json from /public/favicon", () => {
    const manifestPath = resolve(
      process.cwd(),
      "public",
      "favicon",
      "manifest.json",
    );
    const raw = readFileSync(manifestPath, "utf8");
    const manifest = JSON.parse(raw) as Record<string, unknown>;

    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBe("/");
    expect(Array.isArray(manifest.icons)).toBe(true);
    const icons = manifest.icons as Array<{ src: string; sizes: string }>;
    expect(icons.length).toBeGreaterThan(0);
    for (const icon of icons) {
      expect(icon.src).toMatch(/^\/favicon\/|^\/apple-touch-icon\.png$/);
      expect(icon.sizes).toMatch(/^\d+x\d+$/);
    }
  });
});