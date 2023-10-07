import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import { useServer } from "../server.js";
import { getGamePlayersCreateRoute } from "./games-players-create.js";

describe(getGamePlayersCreateRoute.name, () => {
  /** @type {import("../server.js").UseServerReturn} */
  let server;
  /** @type {import('@killer-game/types').GameRecord} */
  let game;

  beforeEach(async () => {
    server = await useServer("test");
    await server.container.db.migrate.latest();
    game = await server.container.gameService.create({ name: "test" });
    await server.container.gameActionsService.update(game.id, ["test"]);
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

  it("should create a player", async () => {
    const res = await server.server.inject({
      method: "POST",
      url: `/games/${game.id}/players`,
      headers: {
        "content-type": "application/json",
      },
      body: { name: "test" },
    });

    assert.strictEqual(res.statusCode, 200, res.body);

    assert.deepEqual(res.json().data, await server.container.db("players").orderBy("created_at", "desc").first());

    assert.equal(await getCount("players"), 1);
  });
});
