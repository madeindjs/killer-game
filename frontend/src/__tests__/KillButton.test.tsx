import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import KillButton from "@/app/[locale]/games/[gameId]/players/[playerId]/kill/components/KillButton";
import { client } from "@/lib/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("KillButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    client.killPlayer.mockResolvedValue({});
  });

  it("calls killPlayer with the player id and kill token when confirmed", async () => {
    const user = userEvent.setup();
    render(<KillButton playerId="player-42" killToken="kill-tok-99" />);

    await user.click(screen.getByRole("button", { name: /^confirm$/i }));

    expect(client.killPlayer).toHaveBeenCalledTimes(1);
    expect(client.killPlayer).toHaveBeenCalledWith("player-42", "kill-tok-99");
  });
});
