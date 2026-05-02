import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import { useServer } from "../server.js";
import { getPlayersAvatarUploadRoute, getPlayersAvatarDeleteRoute } from "./players-avatar-upload.js";
import FormData from "form-data";

describe(getPlayersAvatarUploadRoute.name, () => {
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
    const form = new FormData();
    const testImage = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
    form.append("image", testImage, { filename: "test.png", contentType: "image/png" });

    const res = await server.server.inject({
      method: "POST",
      url: "/players/non-existent/avatar-image",
      headers: {
        authorization: game.private_token,
        ...form.getHeaders(),
      },
      body: form.getBuffer(),
    });

    assert.strictEqual(res.statusCode, 404);
    assert.deepEqual(res.json(), { error: "Player not found" });
  });

  it("should return 403 if token is invalid", async () => {
    const form = new FormData();
    const testImage = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
    form.append("image", testImage, { filename: "test.png", contentType: "image/png" });

    const res = await server.server.inject({
      method: "POST",
      url: `/players/${player.id}/avatar-image`,
      headers: {
        authorization: "invalid-token",
        ...form.getHeaders(),
      },
      body: form.getBuffer(),
    });

    assert.strictEqual(res.statusCode, 403);
    assert.deepEqual(res.json(), { error: "Invalid token" });
  });

  it("should return 403 if no token provided", async () => {
    const form = new FormData();
    const testImage = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
    form.append("image", testImage, { filename: "test.png", contentType: "image/png" });

    const res = await server.server.inject({
      method: "POST",
      url: `/players/${player.id}/avatar-image`,
      headers: {
        authorization: "",
        ...form.getHeaders(),
      },
      body: form.getBuffer(),
    });

    assert.strictEqual(res.statusCode, 403);
    assert.deepEqual(res.json(), { error: "Invalid token" });
  });

  it("should accept upload with player token", async () => {
    const form = new FormData();
    // Minimal valid 1x1 transparent PNG image
    const testImage = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
    form.append("image", testImage, { filename: "test.png", contentType: "image/png" });

    const res = await server.server.inject({
      method: "POST",
      url: `/players/${player.id}/avatar-image`,
      headers: {
        authorization: player.private_token,
        ...form.getHeaders(),
      },
      body: form.getBuffer(),
    });

    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.json().data.avatar_image);
  });

  it("should accept upload with game token", async () => {
    const form = new FormData();
    // Minimal valid 1x1 transparent PNG image
    const testImage = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
    form.append("image", testImage, { filename: "test.png", contentType: "image/png" });

    const res = await server.server.inject({
      method: "POST",
      url: `/players/${player.id}/avatar-image`,
      headers: {
        authorization: game.private_token,
        ...form.getHeaders(),
      },
      body: form.getBuffer(),
    });

    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.json().data.avatar_image);
  });
});

describe(getPlayersAvatarDeleteRoute.name, () => {
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

    // Add a fake avatar image
    await server.container.db("players")
      .where({ id: player.id })
      .update({ avatar_image: Buffer.from("test-image") });
  });

  afterEach(async () => {
    await server.close();
  });

  it("should return 404 if player not found", async () => {
    const res = await server.server.inject({
      method: "DELETE",
      url: "/players/non-existent/avatar-image",
      headers: {
        authorization: game.private_token,
      },
    });

    assert.strictEqual(res.statusCode, 404);
    assert.deepEqual(res.json(), { error: "Player not found" });
  });

  it("should return 403 if token is invalid", async () => {
    const res = await server.server.inject({
      method: "DELETE",
      url: `/players/${player.id}/avatar-image`,
      headers: {
        authorization: "invalid-token",
      },
    });

    assert.strictEqual(res.statusCode, 403);
    assert.deepEqual(res.json(), { error: "Invalid token" });
  });

  it("should delete avatar image with player token", async () => {
    const res = await server.server.inject({
      method: "DELETE",
      url: `/players/${player.id}/avatar-image`,
      headers: {
        authorization: player.private_token,
      },
    });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.json().data.avatar_image, false);

    // Verify it was actually deleted
    const dbPlayer = await server.container.db("players")
      .where({ id: player.id })
      .first("avatar_image");
    assert.strictEqual(dbPlayer.avatar_image, null);
  });

  it("should delete avatar image with game token", async () => {
    const res = await server.server.inject({
      method: "DELETE",
      url: `/players/${player.id}/avatar-image`,
      headers: {
        authorization: game.private_token,
      },
    });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.json().data.avatar_image, false);
  });
});
