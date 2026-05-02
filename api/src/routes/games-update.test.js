import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import { useServer } from "../server.js";
import { getAdminGameUpdateRoute } from "./games-update.js";

describe(getAdminGameUpdateRoute.name, () => {
  /** @type {import("../server.js").UseServerReturn} */
  let server;

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

    await server.container.playerService.create({
      game_id: game.id,
      name: "player 1",
    });

    await server.container.playerService.create({
      game_id: game.id,
      name: "player 2",
    });

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
});
