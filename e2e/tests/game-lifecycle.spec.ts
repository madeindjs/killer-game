import { uniqueGameName } from "../fixtures/api.ts";
import { fillHydrated, waitForHydration } from "../fixtures/hydration.ts";
import { expect, test } from "../fixtures/test.ts";
import { GameDashboardPage } from "../pages/game-dashboard.page.ts";

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

test.describe("Game settings (organizer)", () => {
  test("renames the game", async ({ page, api }) => {
    const game = await api.createGame("rename");
    await api.addPlayer(game, "Alice");
    const dashboard = await new GameDashboardPage(page).goto(game);

    await waitForHydration(dashboard.editButton);
    await dashboard.editButton.click();
    const dialog = dashboard.dialog;
    await expect(dialog.getByRole("heading", { name: "Edit the game" })).toBeVisible();

    const newName = `${game.name} renamed`;
    await fillHydrated(dialog.getByLabel("Title of the game"), newName);
    await dialog.getByRole("button", { name: "Create the game" }).click();

    await expect(dashboard.title).toContainText(newName);
    await expect.poll(async () => (await api.fetchGame(game)).name).toBe(newName);
  });

  test("deletes the game and redirects to the home page", async ({ page, api }) => {
    const game = await api.createGame("delete");
    await api.addPlayer(game, "Alice");
    const dashboard = await new GameDashboardPage(page).goto(game);

    await waitForHydration(dashboard.editButton);
    await dashboard.editButton.click();
    await dashboard.dialog.getByRole("button", { name: "Delete" }).click();

    await page.waitForURL(/\/en\/?$/);
    await expect.poll(() => api.fetchGame(game).then(() => "exists", () => "deleted")).toBe("deleted");
  });

  test("cannot be edited once started", async ({ page, api }) => {
    const game = await api.createGame("locked");
    await api.addPlayers(game, ["Alice", "Bob"]);
    await api.startGame(game);
    const dashboard = await new GameDashboardPage(page).goto(game);

    await expect(dashboard.stopButton).toBeVisible();
    await expect(dashboard.editButton).toBeDisabled();
    await expect(dashboard.inviteButton).toBeDisabled();
  });
});
