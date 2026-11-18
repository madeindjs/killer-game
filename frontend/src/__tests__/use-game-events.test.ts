import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGameEvents } from "@/hooks/use-game-events";
import { client } from "@/lib/client";

const setupGameListener = client.setupGameListener as unknown as ReturnType<typeof vi.fn>;

/** Return the SSE callback registered by the hook. */
function getListener(): (event: { event: string; payload: unknown }) => void {
  return setupGameListener.mock.calls.at(-1)![1];
}

describe("useGameEvents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("listens to the game anonymously by default", () => {
    renderHook(() => useGameEvents("game-1", {}));

    expect(setupGameListener).toHaveBeenCalledWith("game-1", expect.any(Function), undefined);
  });

  it("identifies the player so they are marked as connected", () => {
    const player = { id: "p1", private_token: "tok" };
    renderHook(() => useGameEvents("game-1", {}, { player }));

    expect(setupGameListener).toHaveBeenCalledWith("game-1", expect.any(Function), player);
  });

  it("forwards presence events", () => {
    const setPresence = vi.fn();
    renderHook(() => useGameEvents("game-1", { setPresence }));

    getListener()({ event: "PlayerPresence", payload: { connected_player_ids: ["p1"] } });

    expect(setPresence).toHaveBeenCalledWith({ connected_player_ids: ["p1"] });
  });

  it("forwards player events", () => {
    const addPlayer = vi.fn();
    renderHook(() => useGameEvents("game-1", { addPlayer }));

    getListener()({ event: "PlayerCreated", payload: { id: "p2" } });

    expect(addPlayer).toHaveBeenCalledWith({ id: "p2" });
  });
});
