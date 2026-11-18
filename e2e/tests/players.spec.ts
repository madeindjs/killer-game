import { fillHydrated, waitForHydration } from "../fixtures/hydration.ts";
import { API_URL } from "../fixtures/env.ts";
import { expect, test } from "../fixtures/test.ts";
import { GameDashboardPage } from "../pages/game-dashboard.page.ts";
import { JoinPage, PlayerDashboardPage } from "../pages/player.page.ts";
import { urls } from "../pages/urls.ts";

const AVATAR = new URL("../fixtures/avatar.png", import.meta.url).pathname;

test.describe("Managing players (organizer)", () => {
  test("adds players manually with their action", async ({ page, api }) => {
    const game = await api.createGame("add-players");
    const dashboard = await new GameDashboardPage(page).goto(game);

    // empty game: the form is displayed directly
    await dashboard.addFirstPlayer("Alice", "sing a song");
    await expect(dashboard.toast("The player was added to the game.")).toBeVisible();
    await expect(dashboard.avatar("Alice")).toBeVisible();

    // then through the invitation modal
    await waitForHydration(dashboard.inviteButton);
    await dashboard.inviteButton.click();
    const dialog = dashboard.dialog;
    await expect(dialog.getByRole("heading", { name: "Invite players" })).toBeVisible();
    await fillHydrated(dialog.getByLabel("Name of the player"), "Bob");
    await fillHydrated(dialog.locator('input[name="action"]'), "dance");
    await dialog.getByRole("button", { name: "Create the player" }).click();
    await expect(dashboard.avatar("Bob")).toBeVisible();

    await expect
      .poll(async () => (await api.fetchPlayers(game)).map((p) => `${p.name}:${p.action}`).sort())
      .toEqual(["Alice:sing a song", "Bob:dance"]);
  });

  test("edits then removes a player", async ({ page, api }) => {
    const game = await api.createGame("edit-player");
    const [alice] = await api.addPlayers(game, ["Alice", "Bob"]);
    const dashboard = await new GameDashboardPage(page).goto(game);

    const dialog = await dashboard.openPlayer("Alice");
    await fillHydrated(dialog.locator('input[name="action"]'), "tell a joke");
    await expect(dashboard.toast("Alice was updated.")).toBeVisible();
    await expect.poll(async () => (await api.fetchPlayer(alice)).action).toBe("tell a joke");

    await dialog.getByRole("button", { name: "Delete" }).click();
    await expect(dashboard.toast("Alice left the game.")).toBeVisible();
    await expect(dashboard.avatar("Alice")).toHaveCount(0);
    await expect.poll(async () => (await api.fetchPlayers(game)).map((p) => p.name)).toEqual(["Bob"]);
  });
});

test.describe("Player profile (participant)", () => {
  test("joins with a profile picture, then removes it", async ({ page, api, request }) => {
    const game = await api.createGame("avatar");

    await page.goto(urls.invite(game));
    const uploadButton = page.getByRole("button", { name: "Upload a picture" });
    await waitForHydration(uploadButton);
    const chooser = page.waitForEvent("filechooser");
    await uploadButton.click();
    await (await chooser).setFiles(AVATAR);
    await expect(page.getByRole("img", { name: "Player" })).toBeVisible();

    const player = await new JoinPage(page).join("Alice");
    await expect(player.waitingRoom).toBeVisible();

    const { playerId, privateToken } = player.credentials();
    await expect.poll(async () => (await api.client.fetchPlayer(playerId, privateToken)).avatar_image).toBeTruthy();
    const image = await request.get(`${API_URL}/players/${playerId}/avatar-image`);
    expect(image.ok()).toBe(true);
    expect(image.headers()["content-type"]).toMatch(/^image\//);

    const removeButton = page.getByRole("button", { name: "Remove picture" });
    await waitForHydration(removeButton);
    await removeButton.click();
    await expect(page.getByRole("button", { name: "Upload a picture" })).toBeVisible();
    await expect.poll(async () => (await api.client.fetchPlayer(playerId, privateToken)).avatar_image).toBeFalsy();
  });

  test("customizes the generated avatar", async ({ page, api }) => {
    const game = await api.createGame("avatar-editor");
    const [alice] = await api.addPlayers(game, ["Alice"]);

    await page.goto(urls.player(game, alice));
    await expect(new PlayerDashboardPage(page).waitingRoom).toBeVisible();
    const before = JSON.stringify((await api.fetchPlayer(alice)).avatar);

    const hairButton = page.getByRole("button", { name: "Hair", exact: true });
    await waitForHydration(hairButton);
    await hairButton.click();

    await expect.poll(async () => JSON.stringify((await api.fetchPlayer(alice)).avatar)).not.toBe(before);
  });
});
