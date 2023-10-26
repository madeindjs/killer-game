import assert from "node:assert";
import { after, before, describe, it } from "node:test";
import { useServer } from "../server.js";
import { getAdminGameShowRoute } from "./games-show.js";

describe(getAdminGameShowRoute.name, () => {
  /** @type {import("../server.js").UseServerReturn} */
  let server;
  /** @type {import('@killer-game/types').GameRecord} */
  let game;

  before(async () => {
    server = await useServer("test");
    await server.container.db.migrate.latest();
    game = await server.container.gameService.create({ name: "test" });
  });

  after(async () => {
    await server.close();
  });

  it("should not show with bad auth", async () => {
    const res = await server.server.inject({
      method: "GET",
      url: `/games/${game.id}/status`,
      headers: {
        authorization: game.private_token + 1,
      },
    });

    assert.strictEqual(res.statusCode, 403);
  });

  it("should show with auth", async () => {
    const res = await server.server.inject({
      method: "GET",
      url: `/games/${game.id}/status`,
      headers: {
        authorization: game.private_token,
      },
    });

    assert.strictEqual(res.statusCode, 200);
    assert.deepStrictEqual(res.json().data, { ...game, actions: [] });
  });
});
