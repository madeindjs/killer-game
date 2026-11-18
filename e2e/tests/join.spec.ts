import { expect, test } from "../fixtures/test.ts";
import { GameDashboardPage } from "../pages/game-dashboard.page.ts";
import { JoinPage } from "../pages/player.page.ts";
import { urls } from "../pages/urls.ts";

test.describe("Joining a game (participant)", () => {
  test("the shareable invitation link leads to the join page in the participant's language", async ({
    page,
    api,
  }) => {
    const game = await api.createGame("invite");

    await page.goto(urls.invite(game));

    await expect(page).toHaveURL(new RegExp(`/en/games/(${game.slug}|${game.id})/join$`));
    await expect(page.getByRole("heading", { name: "You have been invited to join a party!" })).toBeVisible();
    await expect(page.getByText("There are no players in the game yet.")).toBeVisible();
  });

  test("the organizer's invitation link and QR code point to the invitation URL", async ({ page, api, baseURL }) => {
    const game = await api.createGame("invite-qr");
    const dashboard = await new GameDashboardPage(page).goto(game);

    const inviteUrl = `${baseURL}${urls.invite(game)}`;
    await expect(dashboard.inviteLink).toHaveValue(inviteUrl);
    await expect(page.getByText("QR code to scan on site")).toBeVisible();
    await expect(page.locator("svg").filter({ has: page.locator("title", { hasText: "Scan to join the game" }) })).toBeVisible();
  });

  test("a participant joins and lands in the waiting room", async ({ page, api }) => {
    const game = await api.createGame("join");
    await api.addPlayer(game, "Alice");

    await page.goto(urls.invite(game));
    await expect(page.getByText("There is already 1 player in the game.")).toBeVisible();
    await expect(page.locator('[title="Alice"]')).toBeVisible();

    const player = await new JoinPage(page).join("Bob");

    await expect(player.waitingRoom).toBeVisible();
    await expect(player.lobbyCount).toHaveText("2 players are in the lobby.");

    // the player really exists in the game
    const players = await api.fetchPlayers(game);
    expect(players.map((p) => p.name).sort()).toEqual(["Alice", "Bob"]);
    expect([game.id, game.slug]).toContain(player.credentials().gameId);
  });

  test("cannot join a game which already started", async ({ page, api }) => {
    const game = await api.createGame("join-started");
    await api.addPlayers(game, ["Alice", "Bob"]);
    await api.startGame(game);

    await page.goto(urls.gameJoin(game));

    await expect(page.getByText("The game already started, you cannot register.")).toBeVisible();
    await expect(new JoinPage(page).submit).toBeDisabled();
  });

  // The HTTP status may be 200: the page is streamed (`[locale]/loading.jsx`)
  // so the status is sent before `notFound()` runs. Assert what users see.
  test("an unknown game shows the not found page", async ({ page }) => {
    for (const url of ["/en/games/this-game-does-not-exist-e2e/join", "/join/this-game-does-not-exist-e2e"]) {
      const response = await page.goto(url);
      expect(response?.status(), url).toBeLessThan(500);
      await expect(page.getByText("Not found", { exact: true })).toBeVisible();
      await expect(page.getByRole("button", { name: "Create the player" })).toHaveCount(0);
    }
  });
});
