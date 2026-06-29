import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GameJoin from "@/components/pages/GameJoin";
import { client } from "@/lib/client";
import * as navigation from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/use-game-events", () => ({
  useGameEvents: vi.fn(),
}));

vi.mock("@/components/organisms/PlayersAvatars", () => ({
  default: () => null,
}));

describe("GameJoin", () => {
  const mockPush = vi.fn();
  const game = {
    id: "game-7",
    slug: "game-7",
    private_token: "game-priv",
    started_at: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(navigation.useRouter).mockReturnValue({
      push: mockPush,
      prefetch: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    });

    client.createPlayer.mockImplementation((_gameId, dto) =>
      Promise.resolve({
        id: "new-player",
        game_id: "game-7",
        name: dto.name,
        private_token: "player-priv",
      }),
    );
  });

  it("calls createPlayer with the game id and payload when joining", async () => {
    const user = userEvent.setup();
    render(<GameJoin game={game} players={[]} />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(client.createPlayer).toHaveBeenCalledTimes(1);
    expect(client.createPlayer).toHaveBeenCalledWith(
      "game-7",
      expect.objectContaining({
        name: "My new player",
      }),
    );
    expect(mockPush).toHaveBeenCalled();
  });

  it("uploads an avatar image after creating the player when a file is selected", async () => {
    const user = userEvent.setup();
    render(<GameJoin game={game} players={[]} />);

    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(["hello"], "avatar.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(client.createPlayer).toHaveBeenCalledTimes(1);
    expect(client.uploadPlayerAvatarImage).toHaveBeenCalledTimes(1);
    expect(client.uploadPlayerAvatarImage).toHaveBeenCalledWith(
      "new-player",
      "player-priv",
      file,
    );
    expect(mockPush).toHaveBeenCalled();
  });
});
