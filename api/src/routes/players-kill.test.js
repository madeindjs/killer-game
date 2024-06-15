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

    player = await server.container.playerService.create({ name: "player 1", game_id: game.id, action: "Test 1" });
    target = await server.container.playerService.create({ name: "player 2", game_id: game.id, action: "Test 2" });
  });

  afterEach(async () => {
    await server.close();
  });

  it("should not kill with bad token", async () => {
    const res = await server.server.inject({
      method: "POST",
      url: `/players/${target.id}/kill`,
      body: {
        kill_token: target.kill_token + 1,
      },
    });

    assert.strictEqual(res.statusCode, 400);
  });

  it("should kill", async () => {
    const res = await server.server.inject({
      method: "POST",
      url: `/players/${target.id}/kill`,
      body: {
        kill_token: target.kill_token,
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
      url: `/players/${target.id}/kill`,
      body: {
        kill_token: target.kill_token,
      },
    });

    const res = await server.server.inject({
      method: "POST",
      url: `/players/${target.id}/kill-next`,
      body: {
        kill_token: target.kill_token,
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
      url: `/players/${player.id}/kill-next`,
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
      url: `/players/${player.id}/kill-next`,
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
