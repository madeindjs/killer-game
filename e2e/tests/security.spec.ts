import { API_URL } from "../fixtures/env.ts";
import { expect, test } from "../fixtures/test.ts";
import { GameDashboardPage } from "../pages/game-dashboard.page.ts";
import { PlayerDashboardPage } from "../pages/player.page.ts";
import { urls } from "../pages/urls.ts";

test.describe("Access control", () => {
  test("the admin dashboard requires the game private token", async ({ page, api }) => {
    const game = await api.createGame("admin-auth");
    await api.addPlayer(game, "Alice");
    const dashboard = new GameDashboardPage(page);

    for (const password of [undefined, "wrong-token"]) {
      await page.goto(urls.gameAdmin({ ...game, private_token: password }));
      await expect(page).toHaveURL(/\/en\/?$/);
      await expect(dashboard.editButton).toHaveCount(0);
    }
  });

  test("a player dashboard requires the player private token", async ({ page, api }) => {
    const game = await api.createGame("player-auth");
    const [alice] = await api.addPlayers(game, ["Alice", "Bob"]);
    await api.startGame(game);
    const player = new PlayerDashboardPage(page);

    for (const password of [undefined, "wrong-token"]) {
      await page.goto(urls.player(game, { ...alice, private_token: password }));
      await expect(player.mission).toHaveCount(0);
      await expect(page.getByText(alice.action)).toHaveCount(0);
    }

    // sanity check: the right token gives access
    await page.goto(urls.player(game, alice));
    await expect(player.mission).toBeVisible();
  });

  test("the API rejects writes without the right token and never leaks secrets", async ({ api, request }) => {
    const game = await api.createGame("api-auth");
    const [alice] = await api.addPlayers(game, ["Alice", "Bob"]);
    const wrong = { Authorization: "wrong-token" };

    expect((await request.put(`${API_URL}/games/${game.id}`, { headers: wrong, data: { name: "hacked" } })).status()).toBe(403);
    expect((await request.delete(`${API_URL}/games/${game.id}`, { headers: wrong })).status()).toBe(403);
    expect((await request.delete(`${API_URL}/games/${game.id}/players/${alice.id}`, { headers: wrong })).status()).toBe(403);
    expect(
      (await request.post(`${API_URL}/players/${alice.id}/kill`, { data: { kill_token: 1 } })).status(),
    ).toBeGreaterThanOrEqual(400);

    const publicGame = (await (await request.get(`${API_URL}/games/${game.id}`)).json()).data;
    expect(publicGame).not.toHaveProperty("private_token");

    const publicPlayers = (await (await request.get(`${API_URL}/games/${game.id}/players`)).json()).data;
    for (const player of publicPlayers) {
      expect(player).not.toHaveProperty("private_token");
      expect(player).not.toHaveProperty("kill_token");
      expect(player).not.toHaveProperty("action");
    }

    const publicPlayer = (await (await request.get(`${API_URL}/players/${alice.id}`)).json()).data;
    expect(publicPlayer).not.toHaveProperty("private_token");
    expect(publicPlayer).not.toHaveProperty("kill_token");

    // nothing changed
    expect((await api.fetchGame(game)).name).toBe(game.name);
    expect(await api.fetchPlayers(game)).toHaveLength(2);
  });
});
