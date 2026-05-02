import assert from "node:assert";
import { afterEach, beforeEach, describe, it, mock } from "node:test";
import { ntfy, ntfyGameDeleted, ntfyGameFinished, ntfyGameStarted } from "./ntfy.js";

describe("ntfy utilities", () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    mock.restoreAll();
  });

  describe(ntfy.name, () => {
    it("should not send notification in non-production/development environments", async () => {
      process.env.NODE_ENV = "test";
      const globalFetch = globalThis.fetch;
      let fetchCalled = false;

      globalThis.fetch = () => {
        fetchCalled = true;
        return Promise.resolve({ ok: true });
      };

      await ntfy("test message", "test-topic");

      assert.strictEqual(fetchCalled, false);

      globalThis.fetch = globalFetch;
    });

    it("should send notification in development environment", async () => {
      process.env.NODE_ENV = "development";

      let fetchCalled = false;
      let fetchUrl = null;
      let fetchBody = null;

      globalThis.fetch = (url, options) => {
        fetchCalled = true;
        fetchUrl = url;
        fetchBody = options?.body;
        return Promise.resolve({ ok: true });
      };

      await ntfy("test message", "custom-topic");

      assert.strictEqual(fetchCalled, true);
      assert.strictEqual(fetchUrl, "https://ntfy.sh/custom-topic");
      assert.strictEqual(fetchBody, "test message");

      delete globalThis.fetch;
    });

    it("should use default topic for production environment", async () => {
      process.env.NODE_ENV = "production";

      let fetchUrl = null;

      globalThis.fetch = (url) => {
        fetchUrl = url;
        return Promise.resolve({ ok: true });
      };

      await ntfy("test message");

      assert.ok(fetchUrl?.includes("the-killer-online-v2_production"));

      delete globalThis.fetch;
    });

    it("should handle fetch errors gracefully", async () => {
      process.env.NODE_ENV = "development";

      globalThis.fetch = () => Promise.reject(new Error("Network error"));

      // Should not throw
      await ntfy("test message", "test-topic");

      delete globalThis.fetch;
    });
  });

  describe(ntfyGameStarted.name, () => {
    it("should call ntfy with game URL and player count", async () => {
      process.env.NODE_ENV = "development";

      let message = null;
      globalThis.fetch = (url, options) => {
        message = options?.body;
        return Promise.resolve({ ok: true });
      };

      const game = { id: "game-1", slug: "test-game" };
      const players = [{ id: "player-1" }, { id: "player-2" }];

      await ntfyGameStarted(game, players);

      assert.ok(message?.includes("[GAME] started with 2 players"));

      delete globalThis.fetch;
    });
  });

  describe(ntfyGameDeleted.name, () => {
    it("should call ntfy with game URL", async () => {
      process.env.NODE_ENV = "development";

      let message = null;
      globalThis.fetch = (url, options) => {
        message = options?.body;
        return Promise.resolve({ ok: true });
      };

      const game = { id: "game-1", slug: "test-game" };

      await ntfyGameDeleted(game);

      assert.ok(message?.includes("[GAME] deleted"));

      delete globalThis.fetch;
    });
  });

  describe(ntfyGameFinished.name, () => {
    it("should call ntfy with game URL and player count", async () => {
      process.env.NODE_ENV = "development";

      let message = null;
      globalThis.fetch = (url, options) => {
        message = options?.body;
        return Promise.resolve({ ok: true });
      };

      const game = { id: "game-1", slug: "test-game" };
      const players = [{ id: "player-1" }, { id: "player-2" }, { id: "player-3" }];

      await ntfyGameFinished(game, players);

      assert.ok(message?.includes("[GAME] finished with 3 players"));

      delete globalThis.fetch;
    });
  });
});
