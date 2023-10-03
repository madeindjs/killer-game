import assert from "node:assert";
import { after, before, describe, it } from "node:test";
import { useServer } from "../server.js";
import { getAdminGameShowRoute } from "./games-show.js";

describe(getAdminGameShowRoute.name, () => {
  /** @type {ReturnType<typeof useServer>} */
  let server;
  /** @type {GameRecord} */
  let game;

  before(async () => {
    server = useServer("test");
    await server.container.db.migrate.latest();
    game = await server.container.gameService.create({ name: "test" });
  });

  after(async () => {
    await server.close();
  });

  it("should get SSE", async () => {
    const res = await new Promise(async (resolve, reject) => {
      const abortController = new AbortController();

      server.server.inject(
        {
          method: "GET",
          url: `/games/${game.id}/sse`,
          signal: abortController.signal,
        },
        (error, res) => {
          if (error) resolve(error);
          resolve(res);
          console.log("ok");
        }
      );

      await server.container.gameService.update({ ...game, name: "updated" });

      abortController.abort();
    });

    console.log(res);

    assert.fail();

    //
  });
});
