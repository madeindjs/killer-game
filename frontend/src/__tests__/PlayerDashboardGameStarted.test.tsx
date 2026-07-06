import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PlayerStatus } from "@killer-game/types";

const playerStatusMock: { current: PlayerStatus | undefined } = {
  current: undefined,
};

vi.mock("@/hooks/use-player-status", () => ({
  usePlayerStatus: () => ({
    error: undefined,
    loading: false,
    playerStatus: playerStatusMock.current,
    load: vi.fn(),
  }),
}));

vi.mock("@/hooks/use-game-dashboard", () => ({
  useGameDashboard: () => ({
    error: undefined,
    loading: false,
    dashboard: undefined,
    load: vi.fn(),
  }),
}));

vi.mock("@/components/organisms/PlayerKillQrCode", () => ({
  default: () => <div data-testid="qr-code-stub" />,
}));

import PlayerDashboardGameStarted from "@/components/pages/PlayerDashboardGameStarted";
import type {
  GameRecordSanitized,
  PlayerRecord,
  PlayerRecordSanitized,
} from "@killer-game/types";

function makePlayer(overrides: Partial<PlayerRecord> = {}): PlayerRecord {
  return {
    id: "player-1",
    game_id: "game-1",
    name: "Alex",
    private_token: "tok",
    action: "do a backflip",
    order: 1,
    kill_token: 1,
    killed_at: null,
    killed_by: null,
    avatar: undefined,
    ...overrides,
  };
}

function makeGame(overrides: Partial<GameRecordSanitized> = {}): GameRecordSanitized {
  return {
    id: "game-1",
    name: "Test game",
    slug: "test-game",
    started_at: new Date().toISOString(),
    finished_at: undefined,
    organizer_email: undefined,
    ...overrides,
  };
}

function makeSanitizedTarget(
  overrides: Partial<PlayerRecordSanitized> = {},
): PlayerRecordSanitized {
  return {
    id: "target-1",
    game_id: "game-1",
    name: "Marie",
    avatar_image: false,
    avatar: undefined,
    ...overrides,
  };
}

describe("PlayerDashboardGameStarted mission text", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    playerStatusMock.current = undefined;
  });

  it("renders the full mission sentence with the current action (regression for #32)", () => {
    const actionName = "chante l'hymne national";
    playerStatusMock.current = {
      current: {
        player: makeSanitizedTarget({ name: "Marie" }),
        action: actionName,
      },
      kills: [],
    };

    render(
      <PlayerDashboardGameStarted
        player={makePlayer()}
        game={makeGame()}
        players={[]}
      />,
    );

    // The target's name and the action both appear as bold <strong> runs
    // inside the mission paragraph. Before the fix, `currentAction?.name`
    // was undefined and the action never rendered, truncating the sentence
    // at "... tu dois faire en sorte que".
    //
    // "Marie" appears twice (header + mission paragraph), so query by role
    // to target the bold run inside the mission sentence.
    const missionPara = screen
      .getByText(/PlayerDashboardGameStartedKillCard\.youNeedToKill/)
      .closest("p");
    expect(missionPara).not.toBeNull();
    expect(missionPara).toHaveTextContent(/Marie/);
    expect(missionPara).toHaveTextContent(actionName);

    // The 🎯 line also echoes the raw action string.
    expect(screen.getByText(`🎯 ${actionName}`)).toBeInTheDocument();
  });

  it("does not crash and renders the target name when the action is null", () => {
    playerStatusMock.current = {
      current: {
        player: makeSanitizedTarget({ name: "Marie" }),
        action: null,
      },
      kills: [],
    };

    render(
      <PlayerDashboardGameStarted
        player={makePlayer()}
        game={makeGame()}
        players={[]}
      />,
    );

    const missionPara = screen
      .getByText(/PlayerDashboardGameStartedKillCard\.youNeedToKill/)
      .closest("p");
    expect(missionPara).not.toBeNull();
    expect(missionPara).toHaveTextContent(/Marie/);
  });
});