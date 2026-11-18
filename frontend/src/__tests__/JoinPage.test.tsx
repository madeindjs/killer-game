import Page from "@/app/[locale]/games/[gameId]/join/page";
import { client } from "@/lib/client";
import { notFound } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/pages/GameJoin", () => ({
  default: () => null,
}));

const fetchGame = vi.mocked(client.fetchGame);
const fetchPlayers = vi.mocked(client.fetchPlayers);

function params(gameId: string) {
  return { params: Promise.resolve({ gameId, locale: "en" }) };
}

describe("JoinPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches the game then its players", async () => {
    const game = { id: "game-1", slug: "game-1", private_token: "tok" };
    fetchGame.mockResolvedValue(game as never);
    fetchPlayers.mockResolvedValue([]);

    await Page(params("game-1"));

    expect(fetchGame).toHaveBeenCalledTimes(1);
    expect(fetchGame).toHaveBeenCalledWith("game-1");
    expect(fetchPlayers).toHaveBeenCalledTimes(1);
    expect(fetchPlayers).toHaveBeenCalledWith("game-1");
  });

  it("calls notFound when the game does not exist", async () => {
    fetchGame.mockResolvedValue(null as never);

    await Page(params("missing"));

    expect(notFound).toHaveBeenCalled();
    expect(fetchPlayers).not.toHaveBeenCalled();
  });

  it("calls notFound instead of crashing when the API responds 404", async () => {
    fetchGame.mockRejectedValue(new Error());

    await Page(params("missing"));

    expect(notFound).toHaveBeenCalled();
    expect(fetchPlayers).not.toHaveBeenCalled();
  });
});
