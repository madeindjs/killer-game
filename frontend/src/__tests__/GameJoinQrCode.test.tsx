import GameJoinQrCode from "@/components/organisms/GameJoinQrCode";
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

const url = "https://the-killer.online/join/my-party";

describe("GameJoinQrCode", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("encodes the invitation link in the QR code", () => {
    render(<GameJoinQrCode game={game} url={url} />);

    const codes = screen.getAllByTestId("qr-code");
    expect(codes).toHaveLength(1);
    expect(codes[0].textContent).toBe(url);
  });

  it("renders nothing until the absolute link is known", () => {
    const { container } = render(<GameJoinQrCode game={game} url="/join/my-party" />);

    expect(container.innerHTML).toBe("");
  });

  it("offers full screen, download and print actions", () => {
    render(<GameJoinQrCode game={game} url={url} />);

    expect(screen.getByRole("button", { name: /GameJoinQrCode.present/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /GameJoinQrCode.download/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /GameJoinQrCode.print/ })).toBeTruthy();
  });

  it("presents a large QR code full screen and closes it", () => {
    render(<GameJoinQrCode game={game} url={url} />);

    fireEvent.click(screen.getByRole("button", { name: /GameJoinQrCode.present/ }));

    expect(screen.getAllByTestId("qr-code")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "My party" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "GameJoinQrCode.close" }));

    expect(screen.getAllByTestId("qr-code")).toHaveLength(1);
  });
});
