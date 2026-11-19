import { waitForHydration } from "../fixtures/hydration.ts";
import { expect, test } from "../fixtures/test.ts";
import { urls } from "../pages/urls.ts";

test.describe("Internationalization", () => {
  test("the root redirects to the English version by default", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(page.getByRole("heading", { level: 1, name: "Killer game generator" })).toBeVisible();
  });

  test.describe("for a French speaker", () => {
    test.use({ locale: "fr-FR" });

    test("the root redirects to the French version", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveURL(/\/fr\/?$/);
      await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    });

    test("the invitation link opens the join page in French", async ({ page, api }) => {
      const game = await api.createGame("i18n-invite");
      await page.goto(urls.invite(game));
      await expect(page).toHaveURL(/\/fr\/games\/[^/]+\/join$/);
      await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    });
  });

  test("the language switcher translates the current page", async ({ page }) => {
    await page.goto("/en/help");
    const switcher = page.getByRole("combobox", { name: "Language" });
    await waitForHydration(switcher);
    await switcher.selectOption("fr");

    await expect(page).toHaveURL(/\/fr\/help$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.getByRole("heading", { level: 1 })).not.toHaveText("How does the killer game work?");
  });
});
