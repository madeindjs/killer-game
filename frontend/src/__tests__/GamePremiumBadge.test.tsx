import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GamePremiumBadge from "@/components/organisms/GamePremiumBadge";
import type { GameRecord } from "@killer-game/types";

// The global vitest.setup.jsx mock for next-intl returns the key as-is, so
// `t("GamePremiumBadge.label")` renders as "GamePremiumBadge.label".

function makeGame(overrides: Partial<GameRecord> = {}): GameRecord {
  return {
    id: "game-1",
    name: "Test game",
    slug: "test-game",
    private_token: "tok",
    premium: false,
    ...overrides,
  };
}

describe("GamePremiumBadge", () => {
  it("renders nothing when the game is not premium", () => {
    const { container } = render(<GamePremiumBadge game={makeGame()} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the Pro badge when the game is premium", () => {
    render(<GamePremiumBadge game={makeGame({ premium: true })} />);
    // The mock translator returns the key as-is; the label is "GamePremiumBadge.label".
    expect(screen.getByText(/GamePremiumBadge\.label/)).toBeInTheDocument();
    // The badge includes a ⭐ emoji.
    expect(screen.getByText(/⭐/)).toBeInTheDocument();
  });
});