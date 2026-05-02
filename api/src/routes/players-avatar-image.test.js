import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import { useServer } from "../server.js";
import { getPlayersAvatarImageRoute } from "./players-avatar-image.js";

describe(getPlayersAvatarImageRoute.name, () => {
  /** @type {import("../server.js").UseServerReturn} */
  let server;
  /** @type {import('@killer-game/types').GameRecord} */
  let game;
  /** @type {import('@killer-game/types').PlayerRecord} */
  let player;

  beforeEach(async () => {
    server = await useServer("test");
    await server.container.db.migrate.latest();
    game = await server.container.gameService.create({ name: "test" });
    player = await server.container.playerService.create({
      name: "test",
      game_id: game.id,
      action: "test",
    });
  });

  afterEach(async () => {
    await server.close();
  });

  it("should return 404 if player not found", async () => {
    const res = await server.server.inject({
      method: "GET",
      url: "/players/non-existent/avatar-image",
    });

    assert.strictEqual(res.statusCode, 404);
    assert.deepEqual(res.json(), { error: "Player or avatar image not found" });
  });

  it("should return 404 if player has no avatar image", async () => {
    const res = await server.server.inject({
      method: "GET",
      url: `/players/${player.id}/avatar-image`,
    });

    assert.strictEqual(res.statusCode, 404);
    assert.deepEqual(res.json(), { error: "Player or avatar image not found" });
  });

  it("should return image with correct headers", async () => {
    // First, upload an image
    const testImageBuffer = Buffer.from("fake-image-data");
    await server.container.db("players")
      .where({ id: player.id })
      .update({ avatar_image: testImageBuffer });

    const res = await server.server.inject({
      method: "GET",
      url: `/players/${player.id}/avatar-image`,
    });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.headers["content-type"], "image/webp");
    assert.ok(res.headers["cache-control"]);
    // Body might be a Buffer or string depending on Fastify's handling
    assert.ok(Buffer.isBuffer(res.body) || typeof res.body === "string");
    if (Buffer.isBuffer(res.body)) {
      assert.deepEqual(res.body, testImageBuffer);
    } else {
      assert.deepEqual(Buffer.from(res.body), testImageBuffer);
    }
  });
});
