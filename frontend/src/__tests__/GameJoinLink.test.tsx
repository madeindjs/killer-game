import GameJoinLink from "@/components/organisms/GameJoinLink";
import type { GameRecord } from "@killer-game/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const game = {
  id: "game-id",
  slug: "my-party",
  name: "My party",
  private_token: "secret",
  started_at: undefined,
} as unknown as GameRecord;

describe("GameJoinLink", () => {
  afterEach(() => {
    delete (navigator as { share?: unknown }).share;
  });

  it("displays the single locale-free invitation link", () => {
    render(<GameJoinLink game={game} />);

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe(`${window.location.origin}/join/my-party`);
    expect(input.value).not.toContain("secret");
  });

  it("hides the share button when the Web Share API is unavailable", () => {
    render(<GameJoinLink game={game} />);

    expect(screen.queryByRole("button", { name: /GameJoinLink.share/ })).toBeNull();
  });

  it("shares the invitation link with the Web Share API", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", { value: share, configurable: true });

    render(<GameJoinLink game={game} />);
    fireEvent.click(await screen.findByRole("button", { name: /GameJoinLink.share/ }));

    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "My party",
        url: `${window.location.origin}/join/my-party`,
      }),
    );
  });

  it("shows a QR code encoding the invitation link", async () => {
    render(<GameJoinLink game={game} />);

    expect((await screen.findByTestId("qr-code")).textContent).toBe(
      `${window.location.origin}/join/my-party`,
    );
  });

  it("warns when the game already started and hides the QR code", () => {
    render(<GameJoinLink game={{ ...game, started_at: "2026-01-01T00:00:00Z" }} />);

    expect(screen.getByText("GameJoinLink.gameStartedWarning")).toBeTruthy();
    expect(screen.queryByTestId("qr-code")).toBeNull();
  });
});
