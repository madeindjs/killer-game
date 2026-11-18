import { describe, expect, it, vi } from "vitest";
import type { PlayerRecord } from "@killer-game/types";
import { getPlayerAvatarConfig } from "@/utils/avatar";

// use the real avatar generator instead of the global test mock
vi.unmock("react-nice-avatar");

function player(avatar: unknown): PlayerRecord {
  return { id: "p1", name: "Alice", game_id: "g1", avatar } as unknown as PlayerRecord;
}

describe("getPlayerAvatarConfig", () => {
  it("returns the stored avatar config", () => {
    const avatar = { sex: "woman", faceColor: "#F9C9B6" };
    expect(getPlayerAvatarConfig(player(avatar))).toEqual(avatar);
    expect(getPlayerAvatarConfig(player(JSON.stringify(avatar)))).toEqual(avatar);
  });

  // players created through the API / MCP have no avatar
  it.each([undefined, null, "null", ""])("generates an avatar when the stored one is %j", (avatar) => {
    const config = getPlayerAvatarConfig(player(avatar));
    expect(config).toBeTruthy();
    expect(config.sex).toBeTruthy();
  });

  it("generates an avatar when the stored one is malformed", () => {
    expect(getPlayerAvatarConfig(player("{not json")).sex).toBeTruthy();
  });
});
