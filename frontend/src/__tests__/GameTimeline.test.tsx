import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GameTimeline } from "@/components/organisms/GameTimeline";
import type { PlayerRecord } from "@killer-game/types";

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

describe("GameTimeline", () => {
  it("does not show any presence indicator by default", () => {
    render(<GameTimeline players={players} />);

    expect(screen.queryAllByRole("img", { name: /connected/ })).toHaveLength(0);
  });

  it("shows an indicator on the connected players", () => {
    render(<GameTimeline players={players} connectedPlayerIds={["p2"]} />);

    const indicators = screen.getAllByRole("img", { name: /connected/ });
    // the chain loops back to the first player, but Bob appears only once
    expect(indicators).toHaveLength(1);
    expect(indicators[0]).toHaveAccessibleName("Bob is connected");
  });
});
