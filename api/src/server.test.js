import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import { useServer } from "./server.js";

describe("API integration", () => {
  /** @type {import("./server.js").UseServerReturn} */
  let server;

  beforeEach(async () => {
    server = await useServer("test");
    await server.container.db.migrate.latest();
  });

  afterEach(async () => {
    await server.close();
  });

  it("should expose the OpenAPI spec without crashing", async () => {
    await server.server.ready();
    const spec = server.server.swagger();
    assert.ok(spec.paths, "OpenAPI spec should contain paths");
  });

  it("should not throw serialization errors for real game and player data", async () => {
    const game = await server.container.gameService.create({
      name: "Integration Test Game",
      organizer_email: "organizer@example.com",
    });

    const player1 = await server.container.playerService.create({
      game_id: game.id,
      name: "Player One",
      action: "Make them wink",
    });

    const player2 = await server.container.playerService.create({
      game_id: game.id,
      name: "Player Two",
      action: "Make them sing",
    });

    // Public game view (sanitized)
    const publicGame = await server.server.inject({
      method: "GET",
      url: `/games/${game.id}`,
    });
    assert.strictEqual(publicGame.statusCode, 200, "public game view should not 500");

    // Admin game view (full record)
    const adminGame = await server.server.inject({
      method: "GET",
      url: `/games/${game.id}`,
      headers: { authorization: game.private_token },
    });
    assert.strictEqual(adminGame.statusCode, 200, "admin game view should not 500");

    // Update game
    const updatedGame = await server.server.inject({
      method: "PUT",
      url: `/games/${game.id}`,
      headers: {
        "content-type": "application/json",
        authorization: game.private_token,
      },
      body: JSON.stringify({ name: "Updated Name" }),
    });
    assert.strictEqual(updatedGame.statusCode, 200, "game update should not 500");

    // Public players list (sanitized)
    const publicPlayers = await server.server.inject({
      method: "GET",
      url: `/games/${game.id}/players`,
    });
    assert.strictEqual(publicPlayers.statusCode, 200, "public players list should not 500");

    // Admin players list (full records)
    const adminPlayers = await server.server.inject({
      method: "GET",
      url: `/games/${game.id}/players`,
      headers: { authorization: game.private_token },
    });
    assert.strictEqual(adminPlayers.statusCode, 200, "admin players list should not 500");

    // Players table
    const table = await server.server.inject({
      method: "GET",
      url: `/games/${game.id}/players/table`,
      headers: { authorization: game.private_token },
    });
    assert.strictEqual(table.statusCode, 200, "players table should not 500");

    // Dashboard
    const dashboard = await server.server.inject({
      method: "GET",
      url: `/games/${game.id}/dashboard`,
      headers: { authorization: game.private_token },
    });
    assert.strictEqual(dashboard.statusCode, 200, "dashboard should not 500");

    // Public player view (sanitized)
    const publicPlayer = await server.server.inject({
      method: "GET",
      url: `/players/${player1.id}`,
    });
    assert.strictEqual(publicPlayer.statusCode, 200, "public player view should not 500");

    // Admin player view (full record)
    const adminPlayer = await server.server.inject({
      method: "GET",
      url: `/players/${player1.id}`,
      headers: { authorization: player1.private_token },
    });
    assert.strictEqual(adminPlayer.statusCode, 200, "admin player view should not 500");

    // Player status
    const status = await server.server.inject({
      method: "GET",
      url: `/players/${player1.id}/status`,
      headers: { authorization: player1.private_token },
    });
    assert.strictEqual(status.statusCode, 200, "player status should not 500");

    // Stats
    const stats = await server.server.inject({
      method: "GET",
      url: "/stats",
    });
    assert.strictEqual(stats.statusCode, 200, "stats should not 500");

    // Start game and test dashboard + kill flow
    await server.server.inject({
      method: "PUT",
      url: `/games/${game.id}`,
      headers: {
        "content-type": "application/json",
        authorization: game.private_token,
      },
      body: JSON.stringify({ name: "Updated Name", started_at: new Date().toISOString() }),
    });

    const dashboardAfterStart = await server.server.inject({
      method: "GET",
      url: `/games/${game.id}/dashboard`,
      headers: { authorization: player1.private_token },
    });
    assert.strictEqual(dashboardAfterStart.statusCode, 200, "dashboard after start should not 500");

    const kill = await server.server.inject({
      method: "POST",
      url: `/players/${player2.id}/kill`,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kill_token: player2.kill_token }),
    });
    assert.strictEqual(kill.statusCode, 200, "kill endpoint should not 500");

    const dashboardAfterKill = await server.server.inject({
      method: "GET",
      url: `/games/${game.id}/dashboard`,
      headers: { authorization: game.private_token },
    });
    assert.strictEqual(dashboardAfterKill.statusCode, 200, "dashboard after kill should not 500");
  });
});
