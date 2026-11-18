import {
  getGameInviteUrl,
  getGameJoinUrl,
  getGameUrl,
  getPlayerKillUrl,
  getPlayerUrl,
} from "@/lib/routes";
import { describe, expect, it } from "vitest";

const game = { id: "game-id", slug: "my-party", private_token: "secret" };
const player = { id: "player-id", private_token: "p-secret", kill_token: 1234 };

describe("routes", () => {
  describe("getGameInviteUrl", () => {
    it("builds a locale-free relative link using the slug", () => {
      expect(getGameInviteUrl(game)).toBe("/join/my-party");
    });

    it("builds an absolute link when an origin is given", () => {
      expect(getGameInviteUrl(game, "https://the-killer.online")).toBe(
        "https://the-killer.online/join/my-party",
      );
    });

    it("falls back to the game id when there is no slug", () => {
      expect(getGameInviteUrl({ id: "game-id", slug: undefined as unknown as string })).toBe(
        "/join/game-id",
      );
    });

    it("never leaks the organizer private token", () => {
      expect(getGameInviteUrl(game, "https://the-killer.online")).not.toContain("secret");
    });
  });

  it("getGameJoinUrl builds the localized join page", () => {
    expect(getGameJoinUrl(game, "fr")).toBe("/fr/games/my-party/join");
    expect(getGameJoinUrl(game, "en", "https://x.y")).toBe("https://x.y/en/games/my-party/join");
  });

  it("getGameUrl adds the private token", () => {
    expect(getGameUrl(game, "en")).toBe("/en/games/my-party?password=secret");
  });

  it("getPlayerUrl and getPlayerKillUrl add the player tokens", () => {
    expect(getPlayerUrl(game, player, "en")).toBe(
      "/en/games/my-party/players/player-id?password=p-secret",
    );
    expect(getPlayerKillUrl(game, player, "en")).toBe(
      "/en/games/my-party/players/player-id/kill?password=1234",
    );
  });
});
