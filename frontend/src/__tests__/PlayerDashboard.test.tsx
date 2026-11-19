import React from "react";
import { act, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { GameRecord, PlayerRecord } from "@killer-game/types";

const { notify } = vi.hoisted(() => ({ notify: vi.fn() }));

vi.mock("@/hooks/use-notifications", () => ({
  useNotifications: () => ({ notify }),
}));

vi.mock("@/components/pages/PlayerDashboardGameStarted", () => ({
  default: () => <div data-testid="started-stub" />,
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

  // the keys live in the `common` namespace (the root translator is used)
  it.each([
    [{ ...game, started_at: null }, { started_at: "2026-01-01T00:00:00.000Z" }, "🏁 common.gameHasStarted"],
    [{ ...game, started_at: "2026-01-01T00:00:00.000Z" }, { started_at: null }, "🎌 common.gameHasStopped"],
  ])("notifies the player when the game starts or stops", (initialGame, update, message) => {
    notify.mockClear();
    vi.mocked(client.setupGameListener).mockClear();
    render(<PlayerDashboard game={initialGame as GameRecord} player={player} players={[]} />);

    const onEvent = vi.mocked(client.setupGameListener).mock.calls[0][1];
    act(() => onEvent({ event: "GameUpdated", payload: { ...initialGame, ...update } }));

    expect(notify).toHaveBeenCalledWith(message);
  });
});
