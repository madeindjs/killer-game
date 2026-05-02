import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GameCreateForm from "@/components/pages/GameCreateForm";
import { client } from "@/lib/client";
import * as navigation from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("GameCreateForm", () => {
  const mockPush = vi.fn();

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

    client.createGame.mockImplementation((dto) =>
      Promise.resolve({
        id: "new-game",
        slug: "new-game",
        name: dto.name,
        private_token: "game-priv",
      }),
    );
  });

  it("calls createGame with the submitted game name then navigates to the game", async () => {
    const user = userEvent.setup();
    render(<GameCreateForm />);

    const input = screen.getByRole("textbox", { name: /GameForm\.nameField/i });
    await user.clear(input);
    await user.type(input, "Friday party");

    await user.click(
      screen.getByRole("button", { name: /GameForm\.submit/i }),
    );

    expect(client.createGame).toHaveBeenCalledTimes(1);
    expect(client.createGame).toHaveBeenCalledWith({
      name: "Friday party",
    });
    expect(mockPush).toHaveBeenCalled();
  });
});
