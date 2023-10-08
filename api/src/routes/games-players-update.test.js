import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import { useServer } from "../server.js";
import { getGamePlayersUpdateRoute } from "./games-players-update.js";

describe(getGamePlayersUpdateRoute.name, () => {
  /** @type {import("../server.js").UseServerReturn} */
  let server;
  /** @type {import('@killer-game/types').GameRecord} */
  let game;
  /** @type {import('@killer-game/types').PlayerRecord} */
  let player;

  beforeEach(async () => {
    server = await useServer("test");
    await server.container.db.migrate.latest();
    game = await server.container.gameService.create({ name: "test" });

    const [action] = await server.container.gameActionsService.update(game.id, [{ name: "action 1" }]);
    player = await server.container.playerService.create({ name: "test", game_id: game.id, action_id: action.id });
  });

  afterEach(async () => {
    await server.close();
  });

  /**
   * @param {string} table
   * @returns
   */
  async function getCount(table) {
    const count = await server.container.db(table).count().first();
    return count?.["count(*)"];
  }

  it("should update", async () => {
    const res = await server.server.inject({
      method: "PUT",
      url: `/games/${game.id}/players/${player.id}`,
      headers: {
        authorization: game.private_token,
      },
      body: {
        ...player,
        avatar: { a: "b" },
      },
    });

    assert.strictEqual(res.statusCode, 200);
    assert.equal(await getCount("players"), 1);
  });

  it.skip("should not remove with bad auth", async () => {
    const res = await server.server.inject({
      method: "PATCH",
      url: `/games/${game.id}/players/${player.id}`,
      headers: {
        authorization: "az",
      },
    });

    assert.strictEqual(res.statusCode, 403);
    assert.equal(await getCount("players"), 1);
  });

  it("should remove", async () => {
    const res = await server.server.inject({
      method: "DELETE",
      url: `/games/${game.id}/players/${player.id}`,
      headers: {
        authorization: game.private_token,
      },
    });

    assert.strictEqual(res.statusCode, 202);
    assert.equal(await getCount("players"), 0);
  });
});
