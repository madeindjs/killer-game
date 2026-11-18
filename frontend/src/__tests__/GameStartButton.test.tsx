import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import GameStartButton from "@/components/organisms/GameStartButton";
import type { GameRecord, PlayerRecord } from "@killer-game/types";

function makeGame(overrides: Partial<GameRecord> = {}): GameRecord {
  return {
    id: "game-1",
    name: "Test game",
    slug: "test-game",
    private_token: "admin-token",
    ...overrides,
  };
}

function makePlayer(id: string, name: string): PlayerRecord {
  return {
    id,
    name,
    game_id: "game-1",
    private_token: `${id}-token`,
    action: "wink",
    order: 0,
    kill_token: 42,
    killed_at: null,
    killed_by: null,
  };
}

const players = [makePlayer("p1", "Alice"), makePlayer("p2", "Bob")];

describe("GameStartButton", () => {
  beforeAll(() => {
    // jsdom does not implement <dialog> methods
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute("open");
    });
  });

  it("does not shuffle by default when confirming the start", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<GameStartButton game={makeGame()} players={players} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /GameStartButton.start/ }));

    const checkbox = screen.getByRole("checkbox", { name: /GameStartButton.shuffle/ });
    expect(checkbox).not.toBeChecked();

    await user.click(screen.getByRole("button", { name: /GameStartButton.confirm/ }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ shuffle: false });
  });

  it("asks to shuffle the chain when the checkbox is checked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<GameStartButton game={makeGame()} players={players} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /GameStartButton.start/ }));
    await user.click(screen.getByRole("checkbox", { name: /GameStartButton.shuffle/ }));
    await user.click(screen.getByRole("button", { name: /GameStartButton.confirm/ }));

    expect(onChange).toHaveBeenCalledWith({ shuffle: true });
  });

  it("stops a started game without the confirmation modal", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <GameStartButton
        game={makeGame({ started_at: new Date().toISOString() })}
        players={players}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /GameStartButton.stop/ }));

    expect(onChange).toHaveBeenCalledWith({ shuffle: false });
    expect(screen.queryByRole("checkbox", { name: /GameStartButton.shuffle/ })).not.toBeInTheDocument();
  });
});
