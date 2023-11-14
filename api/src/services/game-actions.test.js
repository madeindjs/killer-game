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
  /** @type {PlayerService} */
  let playerService;
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

    playerService = new PlayerService(db, subscriber);

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
    });

    it("should not create action twice", async () => {
      await service.update(game.id, [{ name: "test" }]);
      await service.update(game.id, [{ name: "test" }]);
      assert.equal(await getCount(), 1);
    });

    it("should update the name when id provided", async () => {
      const [action] = await service.update(game.id, [{ name: "A" }]);
      await service.update(game.id, [{ name: "B", id: action.id }]);
      assert.equal(await getCount(), 1);

      assert.strictEqual((await service.all(game.id))[0].name, "B");
    });

    it("should remove action", async () => {
      await service.update(game.id, [{ name: "test" }]);
      await service.update(game.id, []);
      assert.equal(await getCount(), 0);
    });

    it("should not remove the action when name provided", async () => {
      const [action] = await service.update(game.id, [{ name: "A" }]);
      await service.update(game.id, [{ name: "A" }]);
      assert.equal(await getCount(), 1);

      assert.strictEqual((await service.all(game.id))[0].id, action.id);
    });

    it("should update player action on change", async () => {
      const [actionA] = await service.create(game.id, [{ name: "A" }]);
      // const [actionA] = await service.update(game.id, [{ name: "A" }]);
      const player1 = await playerService.create({ name: "1", action_id: actionA.id, game_id: game.id });

      const [actionB] = await service.update(game.id, [{ name: "B" }]);

      assert.equal(await getCount(), 1);

      assert.strictEqual((await playerService.fetchById(player1.id)).action_id, actionB.id);
    });
  });
});
