import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import type { GameRecord, PlayerRecord } from "@killer-game/types";
import { useServer, type UseServerReturn } from "../server.ts";
import { getAdminGameUpdateRoute } from "./games-update.ts";

describe(getAdminGameUpdateRoute.name, () => {
  let server: UseServerReturn;

  beforeEach(async () => {
    server = await useServer("test");
    await server.container.db.migrate.latest();
  });

  afterEach(async () => {
    await server.close();
  });

  it("should require authorization header", async () => {
    const game = await server.container.gameService.create({ name: "test game" });

    const res = await server.server.inject({
      method: "PUT",
      url: `/games/${game.id}`,
      headers: {
        "content-type": "application/json",
      },
      body: { name: "updated game" },
    });

    // Schema validation fails first - Authorization header is required
    assert.strictEqual(res.statusCode, 400);
  });

  it("should require valid authorization token", async () => {
    const game = await server.container.gameService.create({ name: "test game" });

    const res = await server.server.inject({
      method: "PUT",
      url: `/games/${game.id}`,
      headers: {
        "content-type": "application/json",
        Authorization: "invalid-token",
      },
      body: { name: "updated game" },
    });

    assert.strictEqual(res.statusCode, 403);
  });

  it("should return 404 for non-existent game", async () => {
    const res = await server.server.inject({
      method: "PUT",
      url: "/games/non-existent-id",
      headers: {
        "content-type": "application/json",
        Authorization: "some-token",
      },
      body: { name: "updated game" },
    });

    assert.strictEqual(res.statusCode, 404);
  });

  it("should require name in body", async () => {
    const game = await server.container.gameService.create({ name: "test game" });

    const res = await server.server.inject({
      method: "PUT",
      url: `/games/${game.id}`,
      headers: {
        "content-type": "application/json",
        Authorization: game.private_token,
      },
      body: {},
    });

    assert.strictEqual(res.statusCode, 400);
  });

  it("should update game name", async () => {
    const game = await server.container.gameService.create({ name: "test game" });

    const res = await server.server.inject({
      method: "PUT",
      url: `/games/${game.id}`,
      headers: {
        "content-type": "application/json",
        Authorization: game.private_token,
      },
      body: { name: "updated game" },
    });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.json().data.name, "updated game");
  });

  it("should prevent starting game with less than 2 players", async () => {
    const game = await server.container.gameService.create({ name: "test game" });

    const res = await server.server.inject({
      method: "PUT",
      url: `/games/${game.id}`,
      headers: {
        "content-type": "application/json",
        Authorization: game.private_token,
      },
      body: { name: "test game", started_at: new Date().toISOString() },
    });

    assert.strictEqual(res.statusCode, 403);
    assert.deepStrictEqual(res.json().error, {
      started_at: "game can't be started because there is no enough players",
    });
  });

  it("should allow starting game with 2 or more players", async () => {
    const game = await server.container.gameService.create({ name: "test game" });

    await server.container.playerService.create({ game_id: game.id, name: "player 1", action: "Action 1" });
    await server.container.playerService.create({ game_id: game.id, name: "player 2", action: "Action 2" });

    const res = await server.server.inject({
      method: "PUT",
      url: `/games/${game.id}`,
      headers: {
        "content-type": "application/json",
        Authorization: game.private_token,
      },
      body: { name: "test game", started_at: new Date().toISOString() },
    });

    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.json().data.started_at);
  });

  it("should update game by slug", async () => {
    const game = await server.container.gameService.create({ name: "test-game-slug" });

    const res = await server.server.inject({
      method: "PUT",
      url: `/games/${game.slug}`,
      headers: {
        "content-type": "application/json",
        Authorization: game.private_token,
      },
      body: { name: "updated game" },
    });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.json().data.name, "updated game");
  });

  describe("shuffle on start", () => {
    let game: GameRecord;

    beforeEach(async () => {
      game = await server.container.gameService.create({ name: "shuffle game" });
      // append every player at the end of the chain: [A, B, C, D]
      server.container.playerService.setRandomForTesting(() => 0.99);
      for (const name of ["A", "B", "C", "D"]) {
        await server.container.playerService.create({ game_id: game.id, name, action: `Action ${name}` });
      }
      // Fisher-Yates with random() = 0 turns [A, B, C, D] into [B, C, D, A]
      server.container.playerService.setRandomForTesting(() => 0);
    });

    async function getChain(): Promise<string[]> {
      const players: PlayerRecord[] = await server.container
        .db("players")
        .where({ game_id: game.id })
        .orderBy("order", "asc");
      return players.map((p) => p.name);
    }

    function updateGame(body: Record<string, unknown>) {
      return server.server.inject({
        method: "PUT",
        url: `/games/${game.id}`,
        headers: { "content-type": "application/json", Authorization: game.private_token },
        body: { name: game.name, ...body },
      });
    }

    it("should keep the chain when starting without shuffle", async () => {
      const res = await updateGame({ started_at: new Date().toISOString() });

      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(await getChain(), ["A", "B", "C", "D"]);
    });

    it("should shuffle the chain when starting with shuffle", async () => {
      const res = await updateGame({ started_at: new Date().toISOString(), shuffle: true });

      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.json().data.started_at);
      assert.deepStrictEqual(await getChain(), ["B", "C", "D", "A"]);
    });

    it("should not shuffle a game which is already started", async () => {
      const startedAt = new Date().toISOString();
      await updateGame({ started_at: startedAt });

      const res = await updateGame({ started_at: startedAt, shuffle: true });

      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(await getChain(), ["A", "B", "C", "D"]);
    });

    it("should not shuffle when only updating the name", async () => {
      const res = await updateGame({ name: "renamed", shuffle: true });

      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(await getChain(), ["A", "B", "C", "D"]);
    });
  });
});
