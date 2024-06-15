import assert from "node:assert";
import { after, before, describe, it } from "node:test";
import { useServer } from "../server.js";
import { getGamePlayersIndexRoute } from "./games-players-index.js";

describe(getGamePlayersIndexRoute.name, () => {
  /** @type {import("../server.js").UseServerReturn} */
  let server;
  /** @type {import('@killer-game/types').GameRecord} */
  let game;
  /** @type {import('@killer-game/types').PlayerRecord} */
  let player;

  before(async () => {
    server = await useServer("test");
    await server.container.db.migrate.latest();
    game = await server.container.gameService.create({ name: "test" });
    player = await server.container.playerService.create({ name: "test", game_id: game.id, action: "Test" });
  });

  after(async () => {
    await server.close();
  });

  it("should list a player for public users", async () => {
    const res = await server.server.inject({
      method: "GET",
      url: `/games/${game.id}/players`,
    });

    assert.strictEqual(res.statusCode, 200);

    assert.equal(res.json().data.length, 1);

    assert.deepStrictEqual(res.json().data[0], server.container.playerService.sanitize(player));
  });

  it("should list a player for private users", async () => {
    const res = await server.server.inject({
      method: "GET",
      url: `/games/${game.id}/players`,
      headers: {
        authorization: game.private_token,
      },
    });

    assert.strictEqual(res.statusCode, 200);

    assert.equal(res.json().data.length, 1);

    assert.deepStrictEqual(res.json().data[0], player);
  });
});
