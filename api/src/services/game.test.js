import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";

import { getMockDB } from "../test/db.mock.js";
import { GameService } from "./games.js";
import { Subscriber } from "./subscriber.js";

describe(GameService.name, () => {
  /** @type {GameService} */
  let service;
  /** @type {Subscriber} */
  let subscriber;
  /** @type {import('knex').Knex} */
  let db;

  beforeEach(async () => {
    db = await getMockDB();
    subscriber = new Subscriber({});
    service = new GameService(db, subscriber);
  });

  afterEach(async () => {
    await db.destroy();
  });

  async function getCount() {
    const count = await db("games").count().first();
    return count?.["count(*)"];
  }

  describe("create", () => {
    it("should create a game", async () => {
      const game = await service.create({ name: "test" });
      assert.notEqual(game.id, undefined);
      assert.equal(await getCount(), 1);
    });
  });

  describe("remove", () => {
    it("should remove the record", async () => {
      const game = await service.create({ name: "test" });
      await service.remove(game);
      assert.equal(await getCount(), 0);
    });
  });
});
