import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import type { GameRecord, PlayerRecord } from "@killer-game/types";
import { useServer, type UseServerReturn } from "../server.ts";
import { getGamePlayersUpdateRoute } from "./games-players-update.ts";

describe(getGamePlayersUpdateRoute.name, () => {
  let server: UseServerReturn;
  let game: GameRecord;
  let player: PlayerRecord;

  beforeEach(async () => {
    server = await useServer("test");
    await server.container.db.migrate.latest();
    game = await server.container.gameService.create({ name: "test" });

    player = await server.container.playerService.create({ name: "test", game_id: game.id, action: "Test" });
  });

  afterEach(async () => {
    await server.close();
  });

  async function getCount(table: string): Promise<unknown> {
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
    // append player 2 at the end of the chain so `player.order` stays accurate
    server.container.playerService.setRandomForTesting(() => 0.99);
    const player2 = await server.container.playerService.create({
      name: "player 2",
      game_id: game.id,
      action: "Action 2",
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
  // players created through the API or MCP have no avatar: the dashboard
  // sends the stored `null` back when the player renames themselves
  it("should update a player without avatar", async () => {
    const res = await server.server.inject({
      method: "PUT",
      url: `/games/${game.id}/players/${player.id}`,
      headers: { authorization: player.private_token },
      body: { ...player, name: "renamed", avatar: null },
    });

    assert.strictEqual(res.statusCode, 200, res.body);
    const updated = await server.container.playerService.fetchById(player.id);
    assert.strictEqual(updated.name, "renamed");
  });

  it("should keep the action when it is not provided", async () => {
    const res = await server.server.inject({
      method: "PUT",
      url: `/games/${game.id}/players/${player.id}`,
      headers: { authorization: player.private_token },
      body: { name: "renamed" },
    });

    assert.strictEqual(res.statusCode, 200, res.body);
    const updated = await server.container.playerService.fetchById(player.id);
    assert.strictEqual(updated.name, "renamed");
    assert.strictEqual(updated.action, "Test");
  });
});
