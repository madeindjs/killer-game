import assert from "node:assert";
import { afterEach, beforeEach, describe, it, mock } from "node:test";

import { getMockDB } from "../test/db.mock.js";
import { mockLogger } from "../test/logger.mock.js";
import { GameActionsService } from "./game-actions.js";
import { GameService } from "./games.js";
import { PlayerService } from "./players.js";
import { Subscriber } from "./subscriber.js";

describe(PlayerService.name, () => {
  /** @type {GameService} */
  let gameService;
  /** @type {GameActionsService} */
  let service;
  /** @type {Subscriber} */
  let subscriber;
  /** @type {import('knex').Knex} */
  let db;
  let mockSubHandler = mock.fn();
  /** @type {import('@killer-game/types').GameRecord} */
  let game;

  beforeEach(async () => {
    db = await getMockDB();
    subscriber = new Subscriber(mockLogger);
    mockSubHandler.mock.resetCalls();
    subscriber.add(mockSubHandler);

    gameService = new GameService(db, subscriber);
    game = await gameService.create({ name: "test" });

    service = new GameActionsService(db, subscriber);
  });

  afterEach(async () => {
    await db.destroy();
  });

  async function getCount() {
    const count = await db("game_actions").count().first();
    return count?.["count(*)"];
  }

  describe("update", () => {
    it("should create actions", async () => {
      const actions = await service.update(game.id, [{ name: "test" }]);
      assert.equal(actions.length, 1);
      assert.equal(await getCount(), 1);

      // assert.equal(mockSubHandler.mock.callCount(), 1);
      // assert.deepEqual(mockSubHandler.mock.calls[0].arguments, [game.id, SubscriberEventNames.GameUpdated, game]);
    });
  });
});
