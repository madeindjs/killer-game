import { uniqueGameName } from "../fixtures/api.ts";
import { fillHydrated, waitForHydration } from "../fixtures/hydration.ts";
import { expect, test } from "../fixtures/test.ts";
import { GameDashboardPage } from "../pages/game-dashboard.page.ts";
import { JoinPage } from "../pages/player.page.ts";
import { urls } from "../pages/urls.ts";

test.describe("My games (/games)", () => {
  test("lists the games created on this device and opens their dashboard", async ({ page, games }) => {
    await page.goto(urls.games());
    await expect(page.getByText("You did not create games yet...")).toBeVisible();

    const name = uniqueGameName("my-games");
    await page.goto(urls.home());
    await fillHydrated(page.getByLabel("Title of the game"), name);
    await page.getByRole("button", { name: "Create the game" }).click();
    await page.waitForURL(/\/games\/[^/]+\?password=/);
    await games.trackFromUrl(page.url());

    // from the navigation bar
    const nav = page.getByRole("link", { name: "Games created" });
    await waitForHydration(nav);
    await nav.click();
    await expect(page).toHaveURL(/\/en\/games$/);

    const card = page.locator(".card").filter({ hasText: name });
    await expect(card).toBeVisible();
    await expect(card.getByText("Draft")).toBeVisible();

    await card.getByRole("link", { name: "See the game" }).click();
    await expect(new GameDashboardPage(page).title.or(page.getByRole("heading", { name: /Welcome to your game/ }))).toContainText(name);
  });

  test("the home page \"Join a game\" button leads to the games list", async ({ page }) => {
    await page.goto(urls.home());
    const join = page.getByRole("link", { name: "Join a game" });
    await waitForHydration(join);
    await join.click();
    await expect(page).toHaveURL(/\/en\/games$/);
    await expect(page.getByRole("heading", { name: "Games joined" })).toBeVisible();
  });

  // Known gap: nothing calls `useGamesJoined().addGame`, so joined games are
  // never recorded and the "Games joined" section is always empty.
  test.fixme("lists the games joined on this device", async ({ page, api }) => {
    const game = await api.createGame("joined-list");
    await page.goto(urls.invite(game));
    await new JoinPage(page).join("Alice");

    await page.goto(urls.games());
    await expect(page.locator(".card").filter({ hasText: game.name })).toBeVisible();
  });
});
