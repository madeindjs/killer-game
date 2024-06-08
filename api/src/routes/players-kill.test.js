import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import { useServer } from "../server.js";
import { getPlayersKillRoute } from "./players-kill.js";

describe(getPlayersKillRoute.name, () => {
  /** @type {import("../server.js").UseServerReturn} */
  let server;
  /** @type {import('@killer-game/types').GameRecord} */
  let game;
  /** @type {import('@killer-game/types').PlayerRecord} */
  let player;
  /** @type {import('@killer-game/types').PlayerRecord} */
  let target;

  beforeEach(async () => {
    server = await useServer("test");
    await server.container.db.migrate.latest();
    game = await server.container.gameService.create({ name: "test" });
    const [action] = await server.container.gameActionsService.create(game.id, [{ name: "action 1" }]);
    player = await server.container.playerService.create({ name: "player 1", game_id: game.id, action_id: action.id });
    target = await server.container.playerService.create({ name: "player 2", game_id: game.id, action_id: action.id });
  });

  afterEach(async () => {
    await server.close();
  });

  it("should not kill with bad auth", async () => {
    const res = await server.server.inject({
      method: "POST",
      url: `/players/${player.id}/kill`,
      body: {
        target_id: target.id,
        kill_token: target.kill_token,
      },
      headers: {
        authorization: target.private_token,
      },
    });

    assert.strictEqual(res.statusCode, 403);
  });

  it("should not kill with bad token", async () => {
    const res = await server.server.inject({
      method: "POST",
      url: `/players/${player.id}/kill`,
      body: {
        target_id: target.id,
        kill_token: target.kill_token + 1,
      },
      headers: {
        authorization: target.private_token,
      },
    });

    assert.strictEqual(res.statusCode, 403);
  });

  it("should kill with auth", async () => {
    const res = await server.server.inject({
      method: "POST",
      url: `/players/${player.id}/kill`,
      body: {
        target_id: target.id,
        kill_token: target.kill_token,
      },
      headers: {
        authorization: player.private_token,
      },
    });

    assert.strictEqual(res.statusCode, 200);
    assert.equal(res.json().success, true);

    const targetUpdated = await server.container.playerService.fetchById(target.id);

    assert.notEqual(targetUpdated.killed_at, null);
    assert.notEqual(targetUpdated.killed_by, null);

    assert.notEqual((await server.container.gameService.fetchByIdOrSlug(game.id)).finished_at, null);
  });

  it("should not kill twice", async () => {
    await server.server.inject({
      method: "POST",
      url: `/players/${player.id}/kill`,
      body: {
        target_id: target.id,
        kill_token: target.kill_token,
      },
      headers: {
        authorization: player.private_token,
      },
    });

    const res = await server.server.inject({
      method: "POST",
      url: `/players/${player.id}/kill`,
      body: {
        target_id: target.id,
        kill_token: target.kill_token,
      },
      headers: {
        authorization: player.private_token,
      },
    });

    assert.strictEqual(res.statusCode, 400);
  });

  it("should not kill if already dead", async () => {
    await server.container.playerService.update({
      ...player,
      killed_at: new Date().toISOString(),
      killed_by: target.id,
    });

    await server.server.inject({
      method: "POST",
      url: `/players/${player.id}/kill`,
      body: {
        target_id: target.id,
        kill_token: target.kill_token,
      },
      headers: {
        authorization: player.private_token,
      },
    });

    const res = await server.server.inject({
      method: "POST",
      url: `/players/${player.id}/kill`,
      body: {
        target_id: target.id,
        kill_token: target.kill_token,
      },
      headers: {
        authorization: player.private_token,
      },
    });

    assert.strictEqual(res.statusCode, 400);

    assert.strictEqual((await server.container.playerService.fetchById(target.id)).killed_by, null);
  });
});
