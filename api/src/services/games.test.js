import assert from "node:assert";
import { afterEach, beforeEach, describe, it, mock } from "node:test";

import { getMockDB } from "../test/db.mock.js";
import { mockLogger } from "../test/logger.mock.js";
import { GameService } from "./games.js";
import { Subscriber, SubscriberEventNames } from "./subscriber.js";

describe(GameService.name, () => {
  /** @type {GameService} */
  let service;
  /** @type {Subscriber} */
  let subscriber;
  /** @type {import('knex').Knex} */
  let db;
  let mockSubHandler = mock.fn();

  beforeEach(async () => {
    db = await getMockDB();
    subscriber = new Subscriber(mockLogger);
    mockSubHandler.mock.resetCalls();
    subscriber.add(mockSubHandler);
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

      assert.equal(mockSubHandler.mock.callCount(), 1);
      assert.deepEqual(mockSubHandler.mock.calls[0].arguments, [game.id, SubscriberEventNames.GameCreated, game]);
    });
  });

  describe("update", () => {
    it("should update a game", async () => {
      const game = await service.create({ name: "test" });
      mockSubHandler.mock.resetCalls();

      const gameUpdated = await service.update({ ...game, name: "test 2" });

      assert.equal(game.id, gameUpdated.id);
      assert.equal(await getCount(), 1);

      assert.equal(mockSubHandler.mock.callCount(), 1);
      assert.deepEqual(mockSubHandler.mock.calls[0].arguments, [
        game.id,
        SubscriberEventNames.GameUpdated,
        gameUpdated,
      ]);
    });
  });

  describe("remove", () => {
    it("should remove the record", async () => {
      const game = await service.create({ name: "test" });
      mockSubHandler.mock.resetCalls();

      await service.remove(game);
      assert.equal(await getCount(), 0);

      assert.equal(mockSubHandler.mock.callCount(), 1);
      assert.deepEqual(mockSubHandler.mock.calls[0].arguments, [game.id, SubscriberEventNames.GameDeleted, game]);
    });
  });
});
