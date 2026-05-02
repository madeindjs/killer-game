import assert from "node:assert";
import { describe, it } from "node:test";
import { Subscriber, SubscriberEventNames } from "./subscriber.js";

describe(Subscriber.name, () => {
  describe("constructor", () => {
    it("should create a subscriber with a logger", () => {
      const logger = { debug: () => {} };
      const subscriber = new Subscriber(logger);
      assert.ok(subscriber);
    });
  });

  describe("add", () => {
    it("should add a handler", () => {
      const logger = { debug: () => {} };
      const subscriber = new Subscriber(logger);

      const handler = () => {};
      subscriber.add(handler);

      // We can't directly access private #handler, but we can verify it was added
      // by checking that emit calls it
      let called = false;
      const testHandler = () => { called = true; };
      subscriber.add(testHandler);
      subscriber.emit("game-1", SubscriberEventNames.GameCreated, {});

      assert.strictEqual(called, true);
    });
  });

  describe("delete", () => {
    it("should remove a handler", () => {
      const logger = { debug: () => {} };
      const subscriber = new Subscriber(logger);

      let called = false;
      const handler = () => { called = true; };

      subscriber.add(handler);
      subscriber.delete(handler);
      subscriber.emit("game-1", SubscriberEventNames.GameCreated, {});

      assert.strictEqual(called, false);
    });
  });

  describe("emit", () => {
    it("should call all added handlers with event data", () => {
      const logger = { debug: () => {} };
      const subscriber = new Subscriber(logger);

      const results = [];

      const handler1 = (gameId, event, payload) => {
        results.push({ gameId, event, payload });
      };

      const handler2 = (gameId, event, payload) => {
        results.push({ gameId, event, payload });
      };

      subscriber.add(handler1);
      subscriber.add(handler2);

      subscriber.emit("game-123", SubscriberEventNames.GameCreated, { name: "test" });

      assert.strictEqual(results.length, 2);
      assert.strictEqual(results[0].gameId, "game-123");
      assert.strictEqual(results[0].event, SubscriberEventNames.GameCreated);
      assert.deepStrictEqual(results[0].payload, { name: "test" });
    });

    it("should not call deleted handlers", () => {
      const logger = { debug: () => {} };
      const subscriber = new Subscriber(logger);

      let called = false;
      const handler = () => { called = true; };

      subscriber.add(handler);
      subscriber.delete(handler);
      subscriber.emit("game-1", SubscriberEventNames.GameUpdated, {});

      assert.strictEqual(called, false);
    });
  });

  describe("SubscriberEventNames", () => {
    it("should have all expected event names", () => {
      const expectedEvents = [
        "GameCreated",
        "GameUpdated",
        "GameDeleted",
        "PlayerCreated",
        "PlayerUpdated",
        "PlayerDeleted",
      ];

      for (const event of expectedEvents) {
        assert.ok(event in SubscriberEventNames);
      }
    });
  });
});
