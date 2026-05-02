import assert from "node:assert";
import { afterEach, beforeEach, describe, it, mock } from "node:test";
import { Container } from "./container.js";

describe(Container.name, () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    mock.restoreAll();
  });

  describe("constructor", () => {
    it("should create a container with logger and env", () => {
      const logger = { debug: () => {} };
      const container = new Container(logger, "development");

      assert.ok(container);
      assert.ok(container.db);
      assert.ok(container.gameService);
      assert.ok(container.playerService);
      assert.ok(container.subscriber);
      assert.strictEqual(container.logger, logger);
    });

    it("should use development config by default", () => {
      const logger = { debug: () => {} };
      const container = new Container(logger);

      assert.ok(container.db);
    });
  });

  describe("getters", () => {
    it("should return db instance", () => {
      const logger = { debug: () => {} };
      const container = new Container(logger, "development");

      const db = container.db;
      assert.ok(db);
      // Knex returns a function (query builder factory)
      assert.strictEqual(typeof db, "function");
    });

    it("should return gameService instance", () => {
      const logger = { debug: () => {} };
      const container = new Container(logger, "development");

      const gameService = container.gameService;
      assert.ok(gameService);
      assert.ok(typeof gameService.create === "function");
      assert.ok(typeof gameService.fetchByIdOrSlug === "function");
      assert.ok(typeof gameService.update === "function");
      assert.ok(typeof gameService.remove === "function");
    });

    it("should return playerService instance", () => {
      const logger = { debug: () => {} };
      const container = new Container(logger, "development");

      const playerService = container.playerService;
      assert.ok(playerService);
      assert.ok(typeof playerService.create === "function");
    });

    it("should return subscriber instance", () => {
      const logger = { debug: () => {} };
      const container = new Container(logger, "development");

      const subscriber = container.subscriber;
      assert.ok(subscriber);
      assert.ok(typeof subscriber.add === "function");
      assert.ok(typeof subscriber.delete === "function");
      assert.ok(typeof subscriber.emit === "function");
    });

    it("should return logger instance", () => {
      const logger = { debug: () => {} };
      const container = new Container(logger, "development");

      const returnedLogger = container.logger;
      assert.strictEqual(returnedLogger, logger);
    });
  });
});
