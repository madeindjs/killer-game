import assert from "node:assert";
import { afterEach, beforeEach, describe, it, mock } from "node:test";
import type { Knex } from "knex";
import type { GameRecord, PlayerRecord } from "@killer-game/types";

import { getMockDB } from "../test/db.mock.js";
import { mockLogger } from "../test/logger.mock.js";
import { GameService } from "./games.js";
import { PlayerService } from "./players.ts";
import { Subscriber, SubscriberEventNames } from "./subscriber.js";

/** Build a deterministic random generator returning the given values in a loop. */
function sequence(...values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length];
}

describe(PlayerService.name, () => {
  let gameService: GameService;
  let service: PlayerService;
  let subscriber: Subscriber;
  let db: Knex;
  const mockSubHandler = mock.fn();
  let game: GameRecord;

  beforeEach(async () => {
    db = await getMockDB();
    subscriber = new Subscriber(mockLogger);
    mockSubHandler.mock.resetCalls();
    subscriber.add(mockSubHandler);

    gameService = new GameService(db, subscriber);
    game = await gameService.create({ name: "test" });

    service = new PlayerService(db, subscriber);

    mockSubHandler.mock.resetCalls();
  });

  afterEach(async () => {
    await db.destroy();
  });

  async function getCount(): Promise<unknown> {
    const count = await db("players").count().first();
    return count?.["count(*)"];
  }

  /** Player names of the game, sorted by their position in the chain. */
  async function getChain(gameId: string = game.id): Promise<string[]> {
    const players: PlayerRecord[] = await db("players").where({ game_id: gameId }).orderBy("order", "asc");
    return players.map((p) => p.name);
  }

  async function getOrders(gameId: string = game.id): Promise<number[]> {
    const players: PlayerRecord[] = await db("players").where({ game_id: gameId }).orderBy("order", "asc");
    return players.map((p) => p.order);
  }

  function createPlayer(name: string, gameId: string = game.id): Promise<PlayerRecord> {
    return service.create({ name, game_id: gameId, action: `Action ${name}` });
  }

  describe("create", () => {
    it("should create a player & emit", async () => {
      const player = await service.create({ name: "test", game_id: game.id, action: "Test 1" });
      assert.notEqual(player.id, undefined);
      assert.equal(await getCount(), 1);

      assert.equal(mockSubHandler.mock.callCount(), 1);
      assert.deepEqual(mockSubHandler.mock.calls[0].arguments, [
        game.id,
        SubscriberEventNames.PlayerCreated,
        service.sanitize(player),
      ]);
    });

    it("should give the first player the order 0", async () => {
      const p1 = await createPlayer("P1");
      assert.equal(p1.order, 0);
    });

    it("should insert a new player at a random position in the chain", async () => {
      // 0.99 -> append at the end, 0 -> insert at the beginning, 0.5 -> in the middle
      service.setRandomForTesting(sequence(0.99, 0.99, 0, 0.5));

      await createPlayer("A"); // [A]
      await createPlayer("B"); // [A, B]
      const c = await createPlayer("C"); // [C, A, B]
      assert.equal(c.order, 0);
      assert.deepEqual(await getChain(), ["C", "A", "B"]);

      const d = await createPlayer("D"); // slot floor(0.5 * 4) = 2 -> [C, A, D, B]
      assert.equal(d.order, 2);
      assert.deepEqual(await getChain(), ["C", "A", "D", "B"]);
      assert.deepEqual(await getOrders(), [0, 1, 2, 3]);
    });

    it("should keep a contiguous chain with concurrent joins", async () => {
      await Promise.all(Array.from({ length: 15 }, (_, i) => createPlayer(`P${i}`)));

      assert.equal(await getCount(), 15);
      assert.deepEqual(
        await getOrders(),
        Array.from({ length: 15 }, (_, i) => i),
      );
    });

    it("should not shift players from another game", async () => {
      const otherGame = await gameService.create({ name: "other" });
      service.setRandomForTesting(() => 0);

      await createPlayer("X", otherGame.id);
      await createPlayer("Y", otherGame.id);
      await createPlayer("A");
      await createPlayer("B");

      assert.deepEqual(await getOrders(otherGame.id), [0, 1]);
      assert.deepEqual(await getChain(otherGame.id), ["Y", "X"]);
    });
  });

  describe("shuffleOrder", () => {
    it("should reassign a random permutation of the orders", async () => {
      service.setRandomForTesting(() => 0.99);
      for (const name of ["A", "B", "C", "D"]) await createPlayer(name);
      assert.deepEqual(await getChain(), ["A", "B", "C", "D"]);

      // Fisher-Yates with random() = 0 always swaps i with 0: [A,B,C,D] -> [B,C,D,A]
      service.setRandomForTesting(() => 0);
      await service.shuffleOrder(game.id);

      assert.deepEqual(await getOrders(), [0, 1, 2, 3]);
      assert.deepEqual(await getChain(), ["B", "C", "D", "A"]);
    });

    it("should keep a valid chain", async () => {
      for (const name of ["A", "B", "C", "D", "E"]) await createPlayer(name);
      await service.shuffleOrder(game.id);

      assert.deepEqual(await getOrders(), [0, 1, 2, 3, 4]);
      const players = await service.fetchPlayers(game.id);
      for (const player of players) {
        const target = await service.getCurrentTarget(player);
        assert.ok(target);
        assert.notEqual(target.id, player.id);
      }
    });

    it("should not emit any event (orders are private)", async () => {
      for (const name of ["A", "B"]) await createPlayer(name);
      mockSubHandler.mock.resetCalls();

      await service.shuffleOrder(game.id);
      assert.equal(mockSubHandler.mock.callCount(), 0);
    });
  });
});
