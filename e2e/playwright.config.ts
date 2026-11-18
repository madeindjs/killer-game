import { defineConfig, devices } from "@playwright/test";
import { API_URL, BASE_URL, IS_LOCAL } from "./fixtures/env.ts";

const CI = !!process.env.CI;
const REPO_ROOT = new URL("..", import.meta.url).pathname;

/**
 * Local stack started by Playwright when targeting localhost. Already running
 * servers (e.g. `pnpm dev`) are reused.
 *
 * Override the commands to test a production build, as the CI does:
 * `E2E_FRONTEND_COMMAND="pnpm --filter @killer-game/frontend start"`.
 */
const webServer = IS_LOCAL
  ? [
      {
        name: "api",
        command: process.env.E2E_API_COMMAND ?? "pnpm --filter @killer-game/api dev",
        cwd: REPO_ROOT,
        url: `${API_URL}/stats`,
        reuseExistingServer: !CI,
        timeout: 120_000,
      },
      {
        name: "frontend",
        command: process.env.E2E_FRONTEND_COMMAND ?? "pnpm --filter @killer-game/frontend dev",
        cwd: REPO_ROOT,
        url: `${BASE_URL}/en`,
        reuseExistingServer: !CI,
        timeout: 180_000,
        env: { NEXT_PUBLIC_API_URL: API_URL },
      },
    ]
  : undefined;

/** Specs exercising what participants do: also run them on a phone. */
const MOBILE_SPECS = /(join|realtime|game-flow)\.spec\.ts/;

export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: CI,
  // the remote environment adds network flakiness (SSE through the reverse proxy)
  retries: IS_LOCAL ? (CI ? 1 : 0) : 2,
  // be gentle with the production server
  workers: IS_LOCAL ? undefined : 2,
  timeout: IS_LOCAL ? 90_000 : 120_000,
  expect: { timeout: IS_LOCAL ? 15_000 : 20_000 },
  reporter: CI ? [["list"], ["html", { open: "never" }], ["github"]] : [["list"], ["html", { open: "never" }]],
  // tests tagged @dev-only have real side effects (payments, leads)
  grepInvert: IS_LOCAL ? undefined : /@dev-only/,
  globalTeardown: "./global-teardown.ts",
  use: {
    baseURL: BASE_URL,
    locale: "en-US",
    permissions: ["notifications", "clipboard-read", "clipboard-write"],
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      testMatch: MOBILE_SPECS,
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer,
});
