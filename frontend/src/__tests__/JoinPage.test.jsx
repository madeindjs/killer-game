import Page from "@/app/[locale]/games/[gameId]/join/page";
import { client } from "@/lib/client";
import { notFound } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/pages/GameJoin", () => ({
  default: () => null,
}));

describe("JoinPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches the game then its players", async () => {
    const game = { id: "game-1", slug: "game-1", private_token: "tok" };
    client.fetchGame.mockResolvedValue(game);
    client.fetchPlayers.mockResolvedValue([]);

    await Page({
      params: Promise.resolve({ gameId: "game-1" }),
    });

    expect(client.fetchGame).toHaveBeenCalledTimes(1);
    expect(client.fetchGame).toHaveBeenCalledWith("game-1");
    expect(client.fetchPlayers).toHaveBeenCalledTimes(1);
    expect(client.fetchPlayers).toHaveBeenCalledWith("game-1");
  });

  it("calls notFound when the game does not exist", async () => {
    client.fetchGame.mockResolvedValue(null);

    await Page({
      params: Promise.resolve({ gameId: "missing" }),
    });

    expect(notFound).toHaveBeenCalled();
    expect(client.fetchPlayers).not.toHaveBeenCalled();
  });
});
