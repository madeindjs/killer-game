import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import { useServer } from "../server.js";
import { getGameDashboardRoute } from "./games-dashboard.js";

describe(getGameDashboardRoute.name, () => {
  /** @type {import("../server.js").UseServerReturn} */
  let server;
  /** @type {import('@killer-game/types').GameRecord} */
  let game;
  /** @type {import('@killer-game/types').PlayerRecord} */

  beforeEach(async () => {
    server = await useServer("test");
    await server.container.db.migrate.latest();
    game = await server.container.gameService.create({ name: "test" });
  });

  afterEach(async () => {
    await server.close();
  });

  it("should not show without auth", async () => {
    const res = await server.server.inject({
      method: "GET",
      url: `/games/${game.id}/dashboard`,
      headers: {
        authorization: game.private_token + 1,
      },
    });

    assert.strictEqual(res.statusCode, 403);
  });

  it("should show with auth", async () => {
    const res = await server.server.inject({
      method: "GET",
      url: `/games/${game.id}/dashboard`,
      headers: {
        authorization: game.private_token,
      },
    });

    assert.strictEqual(res.statusCode, 200);
  });

  describe("test podium", () => {
    /** @type {import("@killer-game/types").PlayerRecord} */
    let player1;
    /** @type {import("@killer-game/types").PlayerRecord} */
    let player2;
    /** @type {import("@killer-game/types").PlayerRecord} */
    let player3;

    beforeEach(async () => {
      const [action] = await server.container.gameActionsService.update(game.id, [{ name: "action 1" }]);

      const createPlayer = (name) =>
        server.container.playerService.create({ name, game_id: game.id, action_id: action.id });

      player1 = await createPlayer("1");
      player2 = await createPlayer("2");
      player3 = await createPlayer("3");
    });

    it("should get an empty podium", async () => {
      const res = await server.server.inject({
        method: "GET",
        url: `/games/${game.id}/dashboard`,
        headers: {
          authorization: game.private_token,
        },
      });

      assert.strictEqual(res.json().data.podium.length, 3);
    });

    it("should get in-progress dashboard", async () => {
      await server.container.playerService.update({
        ...player3,
        killed_at: new Date().toISOString(),
        killed_by: player2.id,
      });

      const res = await server.server.inject({
        method: "GET",
        url: `/games/${game.id}/dashboard`,
        headers: {
          authorization: game.private_token,
        },
      });

      assert.strictEqual(res.json().data.podium[0].player.name, player2.name);
    });
  });
});
