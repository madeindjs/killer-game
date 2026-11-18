import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { GameRecord, PlayerRecord, PlayerRecordSanitized } from "@killer-game/types";

const gameEvents: { setters: Record<string, (payload: unknown) => void> } = { setters: {} };

vi.mock("@/hooks/use-game-events", () => ({
  useGameEvents: (_gameId: string, setters: Record<string, (payload: unknown) => void>) => {
    gameEvents.setters = setters;
  },
}));

vi.mock("@/hooks/use-game-dashboard", () => ({
  useGameDashboard: () => ({ error: undefined, loading: false, dashboard: undefined, load: vi.fn() }),
}));

vi.mock("@/hooks/use-notifications", () => ({
  useNotifications: () => ({ notify: vi.fn() }),
}));

import { GameDashboardContent } from "@/components/pages/GameDashboard";
import { client } from "@/lib/client";

const mockedClient = client as unknown as Record<string, ReturnType<typeof vi.fn>>;

function makeGame(overrides: Partial<GameRecord> = {}): GameRecord {
  return { id: "game-1", name: "Test game", slug: "test-game", private_token: "admin-token", ...overrides };
}

function makePlayer(id: string, name: string, order: number): PlayerRecord {
  return {
    id,
    name,
    game_id: "game-1",
    private_token: `${id}-token`,
    action: "wink",
    order,
    kill_token: 42,
    killed_at: null,
    killed_by: null,
  };
}

const players = [makePlayer("p1", "Alice", 0), makePlayer("p2", "Bob", 1)];

function Harness({ initialGame }: { initialGame: GameRecord }) {
  const [game, setGame] = React.useState(initialGame);
  return <GameDashboardContent game={game} setGame={setGame} players={players} />;
}

describe("GameDashboardContent", () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute("open");
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockedClient.updateGame = vi.fn(async (game: GameRecord) => game);
    mockedClient.fetchPlayers.mockResolvedValue(players);
  });

  it("starts the game with the shuffle option and reloads the chain", async () => {
    const user = userEvent.setup();
    render(<Harness initialGame={makeGame()} />);

    await user.click(screen.getByRole("button", { name: /GameStartButton.start/ }));
    await user.click(screen.getByRole("checkbox", { name: /GameStartButton.shuffle/ }));
    await user.click(screen.getByRole("button", { name: /GameStartButton.confirm/ }));

    await waitFor(() => expect(mockedClient.updateGame).toHaveBeenCalledTimes(1));
    const [payload] = mockedClient.updateGame.mock.calls[0];
    expect(payload.shuffle).toBe(true);
    expect(payload.started_at).toBeTruthy();

    await waitFor(() => expect(mockedClient.fetchPlayers).toHaveBeenCalledWith("game-1", "admin-token"));
  });

  it("does not reload the chain when starting without shuffle", async () => {
    const user = userEvent.setup();
    render(<Harness initialGame={makeGame()} />);

    await user.click(screen.getByRole("button", { name: /GameStartButton.start/ }));
    await user.click(screen.getByRole("button", { name: /GameStartButton.confirm/ }));

    await waitFor(() => expect(mockedClient.updateGame).toHaveBeenCalledTimes(1));
    expect(mockedClient.updateGame.mock.calls[0][0].shuffle).toBe(false);
    expect(mockedClient.fetchPlayers).not.toHaveBeenCalled();
  });

  it("reloads the chain when a player joins, since they are inserted at a random position", async () => {
    render(<Harness initialGame={makeGame()} />);

    const newPlayer: PlayerRecordSanitized = { id: "p3", name: "Eve", game_id: "game-1" };
    await act(async () => gameEvents.setters.addPlayer(newPlayer));

    await waitFor(() => expect(mockedClient.fetchPlayers).toHaveBeenCalledWith("game-1", "admin-token"));
  });
});
