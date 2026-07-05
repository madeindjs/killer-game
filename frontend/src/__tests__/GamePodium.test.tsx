import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GamePodium from "@/components/organisms/GamePodium";
import type { GameDashboard, PlayerRecord } from "@killer-game/types";

// The global vitest.setup.jsx mock for next-intl returns the key as-is
// (no namespace prefix, no ICU interpolation). We assert against that
// behaviour: a header `t("GamePodium.rank")` renders as "rank", a kill
// count `t("killsValueHidden", {count: 1})` renders as "killsValueHidden".
// These tests therefore verify that GamePodium routes its strings through
// next-intl (rather than hardcoding English), and that hidden players are
// rendered with the 🕵️ emoji instead of the literal word "hidden".

function makePlayer(overrides: Partial<PlayerRecord> = {}): PlayerRecord {
  return {
    id: "player-1",
    game_id: "game-1",
    name: "Alice",
    action: "action",
    order: 1,
    kill_token: 1,
    private_token: "tok",
    killed_at: null,
    killed_by: null,
    avatar: undefined,
    ...overrides,
  };
}

describe("GamePodium", () => {
  it("renders the translated column headers", () => {
    render(<GamePodium podium={[]} />);
    expect(screen.getByText("rank")).toBeInTheDocument();
    expect(screen.getByText("player")).toBeInTheDocument();
    expect(screen.getByText("kills")).toBeInTheDocument();
  });

  it("renders an empty podium without crashing", () => {
    const { container } = render(<GamePodium podium={[]} />);
    expect(container.querySelectorAll("tbody tr")).toHaveLength(0);
  });

  it("renders a visible player's name and kill count", () => {
    const winner = makePlayer({ id: "p1", name: "Alice" });
    const victim = makePlayer({ id: "p2", name: "Bob" });

    const podium: GameDashboard["podium"] = [{ player: winner, kills: [victim] }];

    render(<GamePodium podium={podium} />);

    // The visible winner's name is rendered.
    expect(screen.getByText("Alice")).toBeInTheDocument();
    // Kill count: 1 -> "{count} {killSingular}". The count is interpolated
    // manually (it's a plain number, not a translation), the label goes
    // through next-intl and is returned as the key.
    expect(screen.getByText("1 killSingular")).toBeInTheDocument();
  });

  it("renders the kill count with the plural form for multiple kills", () => {
    const winner = makePlayer({ id: "p1", name: "Alice" });
    const v1 = makePlayer({ id: "p2", name: "Bob" });
    const v2 = makePlayer({ id: "p3", name: "Carol" });

    const podium: GameDashboard["podium"] = [{ player: winner, kills: [v1, v2] }];

    render(<GamePodium podium={podium} />);

    expect(screen.getByText("2 killPlural")).toBeInTheDocument();
  });

  it("renders zero kills for a player with no kills", () => {
    const winner = makePlayer({ id: "p1", name: "Alice" });

    const podium: GameDashboard["podium"] = [{ player: winner, kills: [] }];

    render(<GamePodium podium={podium} />);

    expect(screen.getByText("0 killPlural")).toBeInTheDocument();
  });

  it("renders a hidden player with the 🕵️ emoji and not the literal name", () => {
    const hidden = makePlayer({
      id: "hidden-abc-123",
      name: "hidden",
    });
    const victim = makePlayer({ id: "p2", name: "Bob" });

    const podium: GameDashboard["podium"] = [{ player: hidden, kills: [victim] }];

    render(<GamePodium podium={podium} />);

    // Hidden players route through killsValueHidden (no count interpolation
    // in the mocked translator, so the raw key is rendered).
    expect(screen.getByText("killsValueHidden")).toBeInTheDocument();
    // The hidden player is rendered with the 🕵️ emoji (in both the avatar
    // and the name slot), not the literal "hidden" name from the backend.
    expect(screen.getAllByText("🕵️").length).toBeGreaterThan(0);
    expect(screen.queryByText("hidden")).not.toBeInTheDocument();
  });
});