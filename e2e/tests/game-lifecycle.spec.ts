import { uniqueGameName } from "../fixtures/api.ts";
import { fillHydrated } from "../fixtures/hydration.ts";
import { expect, test } from "../fixtures/test.ts";

test.describe("Game lifecycle (organizer)", () => {
  test("creates a game from the home page and lands on its admin dashboard", async ({ page, games, api }) => {
    const name = uniqueGameName("create");

    await page.goto("/en");
    await fillHydrated(page.getByLabel("Title of the game"), name);
    await fillHydrated(page.getByLabel("Your email (optional)"), "e2e@example.com");
    await page.getByRole("button", { name: "Create the game" }).click();

    await page.waitForURL(/\/en\/games\/[^/]+\?password=/);
    const game = await games.trackFromUrl(page.url());

    // empty state of the admin dashboard
    await expect(page.getByRole("heading", { name: /Welcome to your game/ })).toContainText(name);
    await expect(page.getByText("This is your administration panel for your game.")).toBeVisible();
    await expect(page.getByLabel("Invitation link (one link for everyone)")).toHaveValue(
      new RegExp(`/join/${game.id}$|/join/[^/]+$`),
    );
    await expect(page.getByRole("button", { name: "Create the player" })).toBeVisible();

    // the game exists in the API with the given name
    const record = await api.client.fetchGame(game.id, game.private_token);
    expect(record.name).toBe(name);
  });
});
