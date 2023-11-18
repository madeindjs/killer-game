import assert from "node:assert";
import { after, before, describe, it } from "node:test";
import { useServer } from "../server.js";
import { getPlayersStatusRoute } from "./players-status.js";

describe(getPlayersStatusRoute.name, () => {
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
    const [action] = await server.container.gameActionsService.create(game.id, [{ name: "action 1" }]);
    player = await server.container.playerService.create({ name: "test", game_id: game.id, action_id: action.id });
  });

  after(async () => {
    await server.close();
  });

  it("should not show without auth", async () => {
    const res = await server.server.inject({
      method: "GET",
      url: `/players/${player.id}/status`,
      headers: {
        authorization: player.private_token + 1,
      },
    });

    assert.strictEqual(res.statusCode, 403);
  });

  it("should show with auth", async () => {
    const res = await server.server.inject({
      method: "GET",
      url: `/players/${player.id}/status`,
      headers: {
        authorization: player.private_token,
      },
    });

    assert.strictEqual(res.statusCode, 200);
    assert.notEqual(res.json().data.current, undefined);
  });
});
