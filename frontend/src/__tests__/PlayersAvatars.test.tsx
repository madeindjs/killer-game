import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PlayersAvatars from "@/components/organisms/PlayersAvatars";
import type { PlayerRecordSanitized } from "@killer-game/types";

const players: PlayerRecordSanitized[] = [
  { id: "p1", name: "Alice", game_id: "game-1" },
  { id: "p2", name: "Bob", game_id: "game-1" },
];

describe("PlayersAvatars", () => {
  it("does not show any presence indicator by default", () => {
    render(<PlayersAvatars players={players} />);

    expect(screen.queryAllByRole("img", { name: /connected/ })).toHaveLength(0);
  });

  it("shows an indicator only on the connected players", () => {
    render(<PlayersAvatars players={players} connectedPlayerIds={["p1"]} />);

    const indicators = screen.getAllByRole("img", { name: /connected/ });
    expect(indicators).toHaveLength(1);
    expect(indicators[0]).toHaveAccessibleName("Alice is connected");
  });
});
