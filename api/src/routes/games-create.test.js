import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import { useServer } from "../server.js";
import { getGamesCreateRoute } from "./games-create.js";

describe(getGamesCreateRoute.name, () => {
  /** @type {import("../server.js").UseServerReturn} */
  let server;

  beforeEach(async () => {
    server = await useServer("test");
    await server.container.db.migrate.latest();
  });

  afterEach(async () => {
    await server.close();
  });

  /**
   * @param {string} table
   * @returns
   */
  async function getCount(table) {
    const count = await server.container.db(table).count().first();
    return count?.["count(*)"];
  }

  it("should require a body", async () => {
    const res = await server.server.inject({
      method: "POST",
      url: "/games",
    });

    assert.strictEqual(res.statusCode, 400);
  });

  it("should require a valid body", async () => {
    const res = await server.server.inject({
      method: "POST",
      url: "/games",
      headers: {
        "content-type": "application/json",
      },
      body: {},
    });

    assert.strictEqual(res.statusCode, 400);
  });

  it("should create a game with actions", async () => {
    const res = await server.server.inject({
      method: "POST",
      url: "/games",
      headers: {
        "content-type": "application/json",
      },
      body: { name: "test", actions: ["test"] },
    });

    assert.strictEqual(res.statusCode, 200);

    assert.equal(await getCount("games"), 1);
    assert.equal(await getCount("game_actions"), 1);
  });

  it("should create a game without actions", async () => {
    const res = await server.server.inject({
      method: "POST",
      url: "/games",
      headers: {
        "content-type": "application/json",
      },
      body: { name: "test", actions: [] },
    });

    assert.strictEqual(res.statusCode, 200);

    assert.equal(await getCount("games"), 1);
    assert.equal(await getCount("game_actions"), 0);
  });
});
