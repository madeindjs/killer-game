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

    for (const name of ["Alice", "Bob"]) {
      const avatar = screen.getByTitle(name);
      expect(avatar).not.toHaveClass("avatar-online");
      expect(avatar).not.toHaveClass("avatar-offline");
    }
  });

  it("shows which players are connected", () => {
    render(<PlayersAvatars players={players} connectedPlayerIds={["p1"]} />);

    expect(screen.getByTitle("Alice")).toHaveClass("avatar-online");
    expect(screen.getByTitle("Bob")).toHaveClass("avatar-offline");
  });
});
