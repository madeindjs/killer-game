import React from "react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as nextIntl from "next-intl";
import GameLobby from "@/components/organisms/GameLobby";
import type { GameRecord, PlayerRecordSanitized } from "@killer-game/types";

const game: GameRecord = {
  id: "game-1",
  name: "Test game",
  slug: "test-game",
  private_token: "admin-token",
};

function makePlayer(id: string, name: string): PlayerRecordSanitized {
  return { id, name, game_id: "game-1" };
}

/** Translator which renders the interpolated values, so counts can be asserted. */
function mockTranslatorWithValues() {
  const t = ((key: string, values?: Record<string, unknown>) =>
    values ? `${key} ${JSON.stringify(values)}` : key) as any;
  t.rich = t;
  t.markup = t;
  vi.mocked(nextIntl.useTranslations).mockReturnValue(t);
}

describe("GameLobby", () => {
  it("shows the number of players who joined", () => {
    mockTranslatorWithValues();
    render(
      <GameLobby game={game} players={[makePlayer("p1", "Alice"), makePlayer("p2", "Bob"), makePlayer("p3", "Eve")]} />,
    );

    expect(screen.getByText(/GameLobby.playersJoined {"count":3}/)).toBeInTheDocument();
  });

  it("lists the names of the players, sorted alphabetically", () => {
    render(<GameLobby game={game} players={[makePlayer("p2", "Zoe"), makePlayer("p1", "Alice")]} />);

    const list = screen.getByRole("list", { name: /GameLobby.playersList/ });
    const names = within(list)
      .getAllByRole("listitem")
      .map((li) => li.textContent);
    expect(names).toEqual(["Alice", "Zoe"]);
  });

  it("shows the join link so more players can join", () => {
    render(<GameLobby game={game} players={[]} />);

    expect(screen.getByText("GameJoinLink.urlField")).toBeInTheDocument();
  });

  it("warns that at least 2 players are needed", () => {
    render(<GameLobby game={game} players={[makePlayer("p1", "Alice")]} />);

    expect(screen.getByText(/GameLobby.notEnoughPlayers/)).toBeInTheDocument();
    expect(screen.queryByText(/GameLobby.readyToStart/)).not.toBeInTheDocument();
  });

  it("invites the organizer to start once enough players joined", () => {
    render(<GameLobby game={game} players={[makePlayer("p1", "Alice"), makePlayer("p2", "Bob")]} />);

    expect(screen.getByText(/GameLobby.readyToStart/)).toBeInTheDocument();
    expect(screen.queryByText(/GameLobby.notEnoughPlayers/)).not.toBeInTheDocument();
  });
});
