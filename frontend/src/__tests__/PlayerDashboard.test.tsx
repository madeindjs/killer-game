import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { GameRecord, PlayerRecord } from "@killer-game/types";

vi.mock("@/hooks/use-notifications", () => ({
  useNotifications: () => ({ notify: vi.fn() }),
}));

vi.mock("@/components/pages/PlayerDashboardGameUnStarted", () => ({
  default: () => <div data-testid="unstarted-stub" />,
}));

import PlayerDashboard from "@/components/pages/PlayerDashboard";
import { client } from "@/lib/client";

const game: GameRecord = { id: "game-1", name: "Test game", slug: "test-game", private_token: "admin-token" };

const player: PlayerRecord = {
  id: "p1",
  name: "Alice",
  game_id: "game-1",
  private_token: "player-token",
  action: "wink",
  order: 0,
  kill_token: 42,
  killed_at: null,
  killed_by: null,
};

describe("PlayerDashboard", () => {
  it("identifies the player on the game events stream, so they are shown as connected", () => {
    render(<PlayerDashboard game={game} player={player} players={[]} />);

    expect(client.setupGameListener).toHaveBeenCalledWith("game-1", expect.any(Function), {
      id: "p1",
      private_token: "player-token",
    });
  });
});
