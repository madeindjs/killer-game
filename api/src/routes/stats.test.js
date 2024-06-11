import assert from "node:assert";
import { after, before, describe, it } from "node:test";
import { useServer } from "../server.js";
import { getStatsRoute } from "./stats.js";

describe(getStatsRoute.name, () => {
  /** @type {import("../server.js").UseServerReturn} */
  let server;
  /** @type {import('@killer-game/types').GameRecord} */

  before(async () => {
    server = await useServer("test");
    await server.container.db.migrate.latest();

    const game = await server.container.gameService.create({ name: "test" });
    server.container.gameService.update({ ...game, started_at: new Date().toISOString() });
  });

  after(async () => {
    await server.close();
  });

  it("should not show without auth", async () => {
    const res = await server.server.inject({
      method: "GET",
      url: `/stats`,
    });

    assert.deepEqual(res.json().data.counts, {
      games_started: 1,
      games_finished: 0,
      players_killed: 0,
    });
  });
});
