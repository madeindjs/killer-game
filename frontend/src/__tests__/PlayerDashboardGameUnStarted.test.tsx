import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { GameRecordSanitized, PlayerRecord, PlayerRecordSanitized } from "@killer-game/types";

vi.mock("@/hooks/use-game-dashboard", () => ({
  useGameDashboard: () => ({ error: undefined, loading: false, dashboard: undefined, load: vi.fn() }),
}));

vi.mock("@/components/organisms/PlayerForm", () => ({
  default: () => <div data-testid="player-form-stub" />,
}));

import PlayerDashboardGameUnStarted from "@/components/pages/PlayerDashboardGameUnStarted";

const game: GameRecordSanitized = { id: "game-1", name: "Test game", slug: "test-game" };

const player: PlayerRecord = {
  id: "p1",
  name: "Alice",
  game_id: "game-1",
  private_token: "tok",
  action: "wink",
  order: 0,
  kill_token: 42,
  killed_at: null,
  killed_by: null,
};

const players: PlayerRecordSanitized[] = [
  { id: "p1", name: "Alice", game_id: "game-1" },
  { id: "p2", name: "Bob", game_id: "game-1" },
];

describe("PlayerDashboardGameUnStarted", () => {
  it("tells the player to wait for the organizer to launch the game", () => {
    render(<PlayerDashboardGameUnStarted game={game} player={player} players={players} onPlayerChange={vi.fn()} />);

    expect(screen.getByRole("heading", { name: /PlayerDashboardGameUnStarted.title/ })).toBeInTheDocument();
    expect(screen.getByText("PlayerDashboardGameUnStarted.gameWillStartSoon")).toBeInTheDocument();
    expect(screen.getByText("PlayerDashboardGameUnStarted.thereIsPlayerCount")).toBeInTheDocument();
    expect(screen.getByTestId("player-form-stub")).toBeInTheDocument();
  });
});
