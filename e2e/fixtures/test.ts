import { test as base, expect, type BrowserContext, type Page } from "@playwright/test";
import { Api } from "./api.ts";
import { GameRegistry } from "./cleanup.ts";
import { IS_LOCAL } from "./env.ts";

interface Fixtures {
  /** Every game created during the test must be tracked here: it is deleted at the end. */
  games: GameRegistry;
  /** API shortcuts to arrange data (games created through it are tracked automatically). */
  api: Api;
  /**
   * Open a page in a brand new browser context: another "device" with its own
   * localStorage, like a participant opening the invitation on their phone.
   */
  newDevice: () => Promise<Page>;
}

export const test = base.extend<Fixtures>({
  // eslint-disable-next-line no-empty-pattern
  games: async ({}, use) => {
    const registry = new GameRegistry();
    await use(registry);
    // runs even when the test failed
    await registry.cleanup();
  },

  api: async ({ games }, use) => {
    await use(new Api(games));
  },

  newDevice: async ({ browser, contextOptions, baseURL }, use) => {
    const contexts: BrowserContext[] = [];
    await use(async () => {
      const context = await browser.newContext({ ...contextOptions, baseURL });
      contexts.push(context);
      return context.newPage();
    });
    await Promise.all(contexts.map((c) => c.close().catch(() => {})));
  },
});

/**
 * Tag for tests with real external side effects (Stripe checkout, B2B leads
 * sent to Matrix). They are skipped automatically outside a local stack.
 */
export const DEV_ONLY = "@dev-only";

export function skipUnlessLocal(): void {
  test.skip(!IS_LOCAL, "Has real side effects: only runs against a local stack");
}

export { expect };
