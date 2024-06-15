import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import { useServer } from "../server.js";
import { getAdminGamePlayersRemoveRoute } from "./games-players-remove.js";

describe(getAdminGamePlayersRemoveRoute.name, () => {
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

    player = await server.container.playerService.create({ name: "test", game_id: game.id, action: "test" });
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

  it("should not remove without auth", async () => {
    const res = await server.server.inject({
      method: "DELETE",
      url: `/games/${game.id}/players/${player.id}`,
    });

    assert.strictEqual(res.statusCode, 400);
    assert.equal(await getCount("players"), 1);
  });

  it("should not remove with bad auth", async () => {
    const res = await server.server.inject({
      method: "DELETE",
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
