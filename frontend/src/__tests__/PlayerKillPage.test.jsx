import PlayerKillPage from "@/app/[locale]/games/[gameId]/players/[playerId]/kill/page";
import { client } from "@/lib/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock(
  "@/app/[locale]/games/[gameId]/players/[playerId]/kill/components/KillButton",
  () => ({
    default: () => null,
  }),
);

vi.mock("@/components/atoms/HeroWithCard", () => ({
  default: ({ card }) => <div data-testid="hero-card">{card}</div>,
}));

describe("PlayerKillPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads the target player for the kill flow", async () => {
    const player = { id: "player-1", name: "Alex" };
    client.fetchPlayer.mockResolvedValue(player);

    await PlayerKillPage({
      params: Promise.resolve({ playerId: "player-1" }),
      searchParams: Promise.resolve({ password: "kill-secret" }),
    });

    expect(client.fetchPlayer).toHaveBeenCalledTimes(1);
    expect(client.fetchPlayer).toHaveBeenCalledWith("player-1");
  });
});
