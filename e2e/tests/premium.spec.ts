import { waitForHydration } from "../fixtures/hydration.ts";
import { DEV_ONLY, expect, test } from "../fixtures/test.ts";
import { GameDashboardPage } from "../pages/game-dashboard.page.ts";
import { urls } from "../pages/urls.ts";

/**
 * Premium upgrade (Stripe Checkout). Tagged @dev-only: never run against
 * production, even though the Stripe call itself is intercepted here.
 */
test.describe("Premium upgrade", { tag: DEV_ONLY }, () => {
  test("\"Go Pro\" redirects the organizer to the checkout page", async ({ page, api, baseURL }) => {
    const game = await api.createGame("premium");
    await api.addPlayer(game, "Alice");
    await new GameDashboardPage(page).goto(game);

    // don't create a real Stripe session: answer with a fake checkout URL
    const fakeCheckoutUrl = `${baseURL}/en/help?fake-stripe-checkout`;
    let checkoutRequest: Record<string, string> | undefined;
    await page.route("**/games/*/payments/checkout", async (route) => {
      checkoutRequest = route.request().postDataJSON();
      await route.fulfill({ json: { data: { checkout_url: fakeCheckoutUrl, session_id: "cs_test_e2e" } } });
    });

    const goPro = page.getByRole("button", { name: /Go Pro/ });
    await waitForHydration(goPro);
    await goPro.click();

    await page.waitForURL(fakeCheckoutUrl);
    expect(checkoutRequest?.success_url).toContain("checkout=success");
    expect(checkoutRequest?.cancel_url).toContain("checkout=cancel");
    expect(checkoutRequest?.success_url).toContain(`/games/`);
  });

  for (const [result, message] of [
    ["success", "Payment successful — your game is now Pro!"],
    ["cancel", "Payment was cancelled. You can try again anytime."],
  ] as const) {
    test(`shows the checkout ${result} message when coming back from Stripe`, async ({ page, api }) => {
      const game = await api.createGame(`premium-${result}`);
      await api.addPlayer(game, "Alice");

      await page.goto(`${urls.gameAdmin(game)}&checkout=${result}`);
      const dashboard = new GameDashboardPage(page);
      await expect(dashboard.toast(message)).toBeVisible();
      // the query parameter is consumed so a reload doesn't show it again
      await expect(page).not.toHaveURL(/checkout=/);
    });
  }
});
