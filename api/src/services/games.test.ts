import assert from "node:assert";
import { afterEach, beforeEach, describe, it, mock } from "node:test";
import type { Knex } from "knex";
import type { GameRecord } from "@killer-game/types";

import { getMockDB } from "../test/db.mock.js";
import { mockLogger } from "../test/logger.mock.js";
import { GameService } from "./games.ts";
import { Subscriber, SubscriberEventNames } from "./subscriber.js";

describe(GameService.name, () => {
  let service: GameService;
  let subscriber: Subscriber;
  let db: Knex;
  const mockSubHandler = mock.fn();

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

  async function getCount(): Promise<number | string | undefined> {
    const count = await db("games").count().first();
    return count?.["count(*)"];
  }

  describe("create", () => {
    it("should create a game", async () => {
      const game = await service.create({ name: "test" });
      assert.notEqual(game.id, undefined);
      assert.equal(await getCount(), 1);

      assert.equal(mockSubHandler.mock.callCount(), 1);
      assert.deepEqual(mockSubHandler.mock.calls[0].arguments, [
        game.id,
        SubscriberEventNames.GameCreated,
        service.sanitize(game),
      ]);
    });

    it("should create a game with organizer email", async () => {
      const game = await service.create({ name: "test", organizer_email: "test@example.com" });
      assert.notEqual(game.id, undefined);
      assert.equal(await getCount(), 1);
      assert.strictEqual(game.organizer_email, "test@example.com");
    });

    it("should create a game without organizer email", async () => {
      const game = await service.create({ name: "test" });
      assert.notEqual(game.id, undefined);
      assert.equal(await getCount(), 1);
      assert.strictEqual(game.organizer_email, null);
    });
  });

  describe("update", () => {
    let game: GameRecord;

    beforeEach(async () => {
      game = await service.create({ name: "test" });
      mockSubHandler.mock.resetCalls();
    });

    it("should update a game", async () => {
      const gameUpdated = await service.update({ ...game, name: "test 2" });

      assert.equal(game.id, gameUpdated.id);
      assert.equal(await getCount(), 1);

      assert.equal(mockSubHandler.mock.callCount(), 1);
      assert.deepEqual(mockSubHandler.mock.calls[0].arguments, [
        game.id,
        SubscriberEventNames.GameUpdated,
        service.sanitize(gameUpdated),
      ]);
    });
  });

  describe("remove", () => {
    let game: GameRecord;

    beforeEach(async () => {
      game = await service.create({ name: "test" });
      mockSubHandler.mock.resetCalls();
    });

    it("should remove the record", async () => {
      await service.remove(game);
      assert.equal(await getCount(), 0);

      assert.equal(mockSubHandler.mock.callCount(), 1);
      assert.deepEqual(mockSubHandler.mock.calls[0].arguments, [
        game.id,
        SubscriberEventNames.GameDeleted,
        service.sanitize(game),
      ]);
    });

    it("should remove the players of the game", async () => {
      const otherGame = await service.create({ name: "other" });
      const player = (id: string, gameId: string) => ({
        id,
        game_id: gameId,
        name: id,
        action: "action",
        order: 0,
        private_token: `${id}-token`,
        kill_token: 1,
      });
      await db("players").insert([player("p1", game.id), player("p2", game.id), player("p3", otherGame.id)]);

      await service.remove(game);

      const remaining = await db("players").select("id");
      assert.deepEqual(
        remaining.map((p: { id: string }) => p.id),
        ["p3"],
      );
    });
  });

  describe("", () => {
    let game: GameRecord;

    beforeEach(async () => {
      game = await service.create({ name: "test" });
      mockSubHandler.mock.resetCalls();
    });
  });
});
