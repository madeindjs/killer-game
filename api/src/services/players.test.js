import assert from "node:assert";
import { afterEach, beforeEach, describe, it, mock } from "node:test";

import { getMockDB } from "../test/db.mock.js";
import { mockLogger } from "../test/logger.mock.js";
import { GameActionsService } from "./game-actions.js";
import { GameService } from "./games.js";
import { PlayerService } from "./players.js";
import { Subscriber, SubscriberEventNames } from "./subscriber.js";

describe(PlayerService.name, () => {
  /** @type {GameService} */
  let gameService;
  /** @type {GameActionsService} */
  let gameActionsService;
  /** @type {PlayerService} */
  let service;
  /** @type {Subscriber} */
  let subscriber;
  /** @type {import('knex').Knex} */
  let db;
  let mockSubHandler = mock.fn();
  /** @type {import('@killer-game/types').GameRecord} */
  let game;
  let gameActions;

  beforeEach(async () => {
    db = await getMockDB();
    subscriber = new Subscriber(mockLogger);
    mockSubHandler.mock.resetCalls();
    subscriber.add(mockSubHandler);

    gameService = new GameService(db, subscriber);
    game = await gameService.create({ name: "test" });

    gameActionsService = new GameActionsService(db, subscriber);
    gameActions = await gameActionsService.update(game.id, [{ name: "action 1" }]);

    service = new PlayerService(db, subscriber);

    mockSubHandler.mock.resetCalls();
  });

  afterEach(async () => {
    await db.destroy();
  });

  async function getCount() {
    const count = await db("players").count().first();
    return count?.["count(*)"];
  }

  describe("create", () => {
    it("should create a player & emit", async () => {
      const player = await service.create({ name: "test", game_id: game.id, action_id: gameActions[0].id });
      assert.notEqual(player.id, undefined);
      assert.equal(await getCount(), 1);

      assert.equal(mockSubHandler.mock.callCount(), 1);
      assert.deepEqual(mockSubHandler.mock.calls[0].arguments, [
        game.id,
        SubscriberEventNames.PlayerCreated,
        service.sanitize(player),
      ]);
    });

    it("should link the two players", async () => {
      const p1 = await service.create({ name: "P1", game_id: game.id, action_id: gameActions[0].id });
      assert.equal(mockSubHandler.mock.callCount(), 1);
      assert.equal(p1.order, 0);

      const p2 = await service.create({ name: "P2", game_id: game.id, action_id: gameActions[0].id });
      assert.equal(mockSubHandler.mock.callCount(), 2);
      assert.equal(p2.order, 1);

      assert.equal(await getCount(), 2);
    });
  });

  // describe("update", () => {
  //   it("should update a game", async () => {
  //     const game = await service.create({ name: "test" });
  //     mockSubHandler.mock.resetCalls();

  //     const gameUpdated = await service.update({ ...game, name: "test 2" });

  //     assert.equal(game.id, gameUpdated.id);
  //     assert.equal(await getCount(), 1);

  //     assert.equal(mockSubHandler.mock.callCount(), 1);
  //     assert.deepEqual(mockSubHandler.mock.calls[0].arguments, [
  //       game.id,
  //       SubscriberEventNames.GameUpdated,
  //       gameUpdated,
  //     ]);
  //   });
  // });

  // describe("remove", () => {
  //   it("should remove the record", async () => {
  //     const game = await service.create({ name: "test" });
  //     mockSubHandler.mock.resetCalls();

  //     await service.remove(game);
  //     assert.equal(await getCount(), 0);

  //     assert.equal(mockSubHandler.mock.callCount(), 1);
  //     assert.deepEqual(mockSubHandler.mock.calls[0].arguments, [game.id, SubscriberEventNames.GameDeleted, game]);
  //   });
  // });
});
