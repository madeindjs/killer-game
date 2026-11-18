import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { PresenceService } from "./presence.ts";

describe(PresenceService.name, () => {
  let presence: PresenceService;

  beforeEach(() => {
    presence = new PresenceService();
  });

  it("should list no connected player by default", () => {
    assert.deepStrictEqual(presence.getConnectedPlayerIds("game-1"), []);
  });

  it("should report a player online on its first connection only", () => {
    assert.strictEqual(presence.connect("game-1", "p1"), true);
    assert.strictEqual(presence.connect("game-1", "p1"), false);

    assert.deepStrictEqual(presence.getConnectedPlayerIds("game-1"), ["p1"]);
  });

  it("should keep a player online until its last connection is closed", () => {
    presence.connect("game-1", "p1");
    presence.connect("game-1", "p1");

    assert.strictEqual(presence.disconnect("game-1", "p1"), false);
    assert.deepStrictEqual(presence.getConnectedPlayerIds("game-1"), ["p1"]);

    assert.strictEqual(presence.disconnect("game-1", "p1"), true);
    assert.deepStrictEqual(presence.getConnectedPlayerIds("game-1"), []);
  });

  it("should ignore disconnecting an unknown player", () => {
    assert.strictEqual(presence.disconnect("game-1", "p1"), false);
  });

  it("should track games separately", () => {
    presence.connect("game-1", "p1");
    presence.connect("game-2", "p2");

    assert.deepStrictEqual(presence.getConnectedPlayerIds("game-1"), ["p1"]);
    assert.deepStrictEqual(presence.getConnectedPlayerIds("game-2"), ["p2"]);
  });
});
