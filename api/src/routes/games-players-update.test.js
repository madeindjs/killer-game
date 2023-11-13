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
  /** @type {import("@killer-game/types").GameActionRecord[]} */
  let actions;

  beforeEach(async () => {
    server = await useServer("test");
    await server.container.db.migrate.latest();
    game = await server.container.gameService.create({ name: "test" });

    actions = await server.container.gameActionsService.update(game.id, [{ name: "action 1" }]);
    player = await server.container.playerService.create({ name: "test", game_id: game.id, action_id: actions[0].id });
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

  it("should not remove with bad auth", async () => {
    const res = await server.server.inject({
      method: "PATCH",
      url: `/games/${game.id}/players/${player.id}`,
      headers: {
        authorization: "az",
      },
    });

    assert.strictEqual(res.statusCode, 404);
    assert.equal(await getCount("players"), 1);
  });

  it("should update and swap order", async () => {
    const player2 = await server.container.playerService.create({
      name: "player 2",
      game_id: game.id,
      action_id: actions[0].id,
    });

    const res = await server.server.inject({
      method: "PUT",
      url: `/games/${game.id}/players/${player2.id}`,
      headers: {
        authorization: game.private_token,
      },
      body: {
        ...player2,
        order: player.order,
        avatar: { a: 1 },
      },
    });

    assert.strictEqual(res.statusCode, 200);

    assert.strictEqual((await server.container.playerService.fetchById(player.id)).order, player2.order);
    assert.strictEqual((await server.container.playerService.fetchById(player2.id)).order, player.order);
  });
});
