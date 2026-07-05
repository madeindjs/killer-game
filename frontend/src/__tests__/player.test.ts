import { describe, expect, it } from "vitest";
import { isPlayerHidden } from "@/utils/player";
import { pluralize, pluralizeKills, pluralizePlayers } from "@/utils/pluralize";
import type { PlayerRecord, PlayerRecordSanitized } from "@killer-game/types";

function makeSanitized(
  overrides: Partial<PlayerRecordSanitized> = {},
): PlayerRecordSanitized {
  return {
    id: "player-1",
    game_id: "game-1",
    name: "Alice",
    avatar: undefined,
    ...overrides,
  };
}

describe("isPlayerHidden", () => {
  it("returns false for undefined / null", () => {
    expect(isPlayerHidden(undefined)).toBe(false);
    expect(isPlayerHidden(null)).toBe(false);
  });

  it("detects the legacy exact \"hidden\" id", () => {
    expect(isPlayerHidden(makeSanitized({ id: "hidden", name: "hidden" }))).toBe(true);
  });

  it("detects anonymized ids with the hidden- prefix", () => {
    expect(
      isPlayerHidden(makeSanitized({ id: "hidden-abc-123", name: "hidden" })),
    ).toBe(true);
  });

  it("detects a player whose name was anonymized to \"hidden\"", () => {
    expect(isPlayerHidden(makeSanitized({ id: "abc", name: "hidden" }))).toBe(true);
  });

  it("returns false for a regular visible player", () => {
    expect(isPlayerHidden(makeSanitized({ id: "player-1", name: "Alice" }))).toBe(false);
  });

  it("returns false for a full PlayerRecord that is not anonymized", () => {
    const player: PlayerRecord = {
      id: "player-1",
      game_id: "game-1",
      name: "Alice",
      action: "action",
      order: 1,
      kill_token: 1,
      private_token: "tok",
      killed_at: null,
      killed_by: null,
      avatar: undefined,
    };
    expect(isPlayerHidden(player)).toBe(false);
  });
});

describe("pluralize", () => {
  it("returns the singular form for count === 1", () => {
    expect(pluralize(1, "kill", "kills")).toBe("kill");
  });

  it("returns the plural form for count === 0", () => {
    expect(pluralize(0, "kill", "kills")).toBe("kills");
  });

  it("returns the plural form for count > 1", () => {
    expect(pluralize(5, "kill", "kills")).toBe("kills");
  });

  it("pluralizeKills formats count + English word", () => {
    expect(pluralizeKills(0)).toBe("0 kills");
    expect(pluralizeKills(1)).toBe("1 kill");
    expect(pluralizeKills(3)).toBe("3 kills");
  });

  it("pluralizePlayers formats count + English word", () => {
    expect(pluralizePlayers(0)).toBe("0 players");
    expect(pluralizePlayers(1)).toBe("1 player");
    expect(pluralizePlayers(2)).toBe("2 players");
  });
});