import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import { useServer } from "../server.js";
import { getGamePlayersTableRoute } from "./games-players-table.js";

describe(getGamePlayersTableRoute.name, () => {
  /** @type {import("../server.js").UseServerReturn} */
  let server;
  /** @type {import('@killer-game/types').GameRecord} */
  let game;

  beforeEach(async () => {
    server = await useServer("test");
    await server.container.db.migrate.latest();
    game = await server.container.gameService.create({ name: "test" });
  });

  afterEach(async () => {
    await server.close();
  });

  it("should not show with bad auth", async () => {
    const res = await server.server.inject({
      method: "GET",
      url: `/games/${game.id}/players/table`,
      headers: {
        authorization: game.private_token + 1,
      },
    });

    assert.strictEqual(res.statusCode, 403);
  });

  it("should show with auth", async () => {
    const res = await server.server.inject({
      method: "GET",
      url: `/games/${game.id}/players/table`,
      headers: {
        authorization: game.private_token,
      },
    });

    assert.strictEqual(res.statusCode, 200);
  });

  it("should get table with two consecutive players", async () => {
    const [action] = await server.container.gameActionsService.create(game.id, [{ name: "action 1" }]);
    const player1 = await server.container.playerService.create({
      action_id: action.id,
      game_id: game.id,
      name: "player 1",
    });
    const player2 = await server.container.playerService.create({
      action_id: action.id,
      game_id: game.id,
      name: "player 2",
    });

    const res = await server.server.inject({
      method: "GET",
      url: `/games/${game.id}/players/table`,
      headers: {
        authorization: game.private_token,
      },
    });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.json().data.length, 2);

    const [row1, row2] = res.json().data;

    assert.strictEqual(row1.player.name, player1.name);
    assert.strictEqual(row1.action.name, action.name);
    assert.strictEqual(row1.target.name, player2.name);

    assert.strictEqual(row2.player.name, player2.name);
    assert.strictEqual(row2.action.name, action.name);
    assert.strictEqual(row2.target.name, player1.name);
  });

  it.only("should get table with two consecutive players without zero", async () => {
    const [action] = await server.container.gameActionsService.create(game.id, [{ name: "action 1" }]);
    const player1 = await server.container.playerService.create({
      action_id: action.id,
      game_id: game.id,
      name: "player 1",
    });
    const player2 = await server.container.playerService.create({
      action_id: action.id,
      game_id: game.id,
      name: "player 2",
    });
    const player3 = await server.container.playerService.create({
      action_id: action.id,
      game_id: game.id,
      name: "player 3",
    });

    await server.container.playerService.remove(player1);

    const res = await server.server.inject({
      method: "GET",
      url: `/games/${game.id}/players/table`,
      headers: {
        authorization: game.private_token,
      },
    });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.json().data.length, 2);

    const [row1, row2] = res.json().data;

    assert.strictEqual(row1.player.name, player2.name);
    assert.strictEqual(row1.action.name, action.name);
    assert.strictEqual(row1.target.name, player3.name);

    assert.strictEqual(row2.player.name, player3.name);
    assert.strictEqual(row2.action.name, action.name);
    assert.strictEqual(row2.target?.name, player2.name);
  });
});
