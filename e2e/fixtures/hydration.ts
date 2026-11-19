import { expect, type Locator } from "@playwright/test";

/**
 * Wait until React hydrated the given element.
 *
 * Pages are server-rendered: interacting with a form before hydration is lost
 * (React resets controlled inputs and the submit handler is not attached yet).
 * React attaches `__reactFiber$<id>` / `__reactProps$<id>` keys to every DOM
 * node it manages, which is a reliable hydration marker.
 */
export async function waitForHydration(locator: Locator): Promise<void> {
  await expect
    .poll(
      () =>
        locator.evaluate((el) => Object.keys(el).some((key) => key.startsWith("__reactProps$"))).catch(() => false),
      { message: "element should be hydrated by React", timeout: 30_000 },
    )
    .toBe(true);
}

/** Fill an input once hydrated, and check React kept the value. */
export async function fillHydrated(locator: Locator, value: string): Promise<void> {
  await waitForHydration(locator);
  await locator.fill(value);
  await expect(locator).toHaveValue(value);
}
