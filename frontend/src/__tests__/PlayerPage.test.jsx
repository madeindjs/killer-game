import Page from "@/app/[locale]/games/[gameId]/players/[playerId]/page";
import { client } from "@/lib/client";
import { notFound, redirect } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/pages/PlayerDashboard", () => ({
  default: () => null,
}));

describe("PlayerPage", () => {
  const player = {
    id: "player-1",
    game_id: "game-1",
    private_token: "player-tok",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches the player, then the game, then all players", async () => {
    client.fetchPlayer.mockResolvedValue(player);
    client.fetchGame.mockResolvedValue({ id: "game-1" });
    client.fetchPlayers.mockResolvedValue([]);

    await Page({
      params: Promise.resolve({ playerId: "player-1" }),
      searchParams: Promise.resolve({ password: "secret" }),
    });

    expect(client.fetchPlayer).toHaveBeenCalledWith("player-1", "secret");
    expect(client.fetchGame).toHaveBeenCalledWith("game-1");
    expect(client.fetchPlayers).toHaveBeenCalledWith("game-1");
  });

  it("calls notFound when the player is missing", async () => {
    client.fetchPlayer.mockResolvedValue(null);

    await Page({
      params: Promise.resolve({ playerId: "player-1" }),
      searchParams: Promise.resolve({ password: "secret" }),
    });

    expect(notFound).toHaveBeenCalled();
    expect(client.fetchGame).not.toHaveBeenCalled();
  });

  it("redirects home when the player has no private_token", async () => {
    client.fetchPlayer.mockResolvedValue({
      ...player,
      private_token: null,
    });

    await Page({
      params: Promise.resolve({ playerId: "player-1" }),
      searchParams: Promise.resolve({ password: "secret" }),
    });

    expect(redirect).toHaveBeenCalledWith("/");
    expect(client.fetchGame).not.toHaveBeenCalled();
  });
});
