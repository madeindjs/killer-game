import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GameUpgradeButton from "@/components/organisms/GameUpgradeButton";
import { client } from "@/lib/client";
import type { GameRecord } from "@killer-game/types";

// The global vitest.setup.jsx mock for next-intl returns the key as-is.
// @/context/Toast is mocked globally with ToastProvider (passthrough) and a
// ToastContext whose `push` is a vi.fn(). @/lib/client is mocked too; we
// re-import the mocked `client` here to spy on `createCheckoutSession`.

function makeGame(overrides: Partial<GameRecord> = {}): GameRecord {
  return {
    id: "game-1",
    name: "Test game",
    slug: "test-game",
    private_token: "tok-123",
    premium: false,
    ...overrides,
  };
}

describe("GameUpgradeButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // jsdom doesn't implement navigation; reset href before each test.
    Object.defineProperty(window, "location", {
      value: { ...window.location, href: "" },
      writable: true,
    });
  });

  it("renders the CTA when the game is not premium", () => {
    render(<GameUpgradeButton game={makeGame()} />);
    expect(screen.getByText(/GameUpgradeButton\.cta/)).toBeInTheDocument();
  });

  it("renders nothing when the game is already premium", () => {
    const { container } = render(<GameUpgradeButton game={makeGame({ premium: true })} />);
    expect(container.firstChild).toBeNull();
  });

  it("calls createCheckoutSession and redirects to checkout_url on click", async () => {
    const checkoutUrl = "https://checkout.stripe.com/c/pay/cs_test_1";
    client.createCheckoutSession = vi.fn().mockResolvedValue({
      checkout_url: checkoutUrl,
      session_id: "cs_test_1",
    });

    render(<GameUpgradeButton game={makeGame()} />);
    fireEvent.click(screen.getByText(/GameUpgradeButton\.cta/));

    await waitFor(() => {
      expect(client.createCheckoutSession).toHaveBeenCalledWith(
        "game-1",
        "tok-123",
        expect.objectContaining({
          successUrl: expect.stringContaining("/games/test-game?"),
          cancelUrl: expect.stringContaining("/games/test-game?"),
        }),
      );
      expect(window.location.href).toBe(checkoutUrl);
    });
  });

  it("does not redirect when createCheckoutSession rejects", async () => {
    client.createCheckoutSession = vi.fn().mockRejectedValue(new Error("network"));

    render(<GameUpgradeButton game={makeGame()} />);
    fireEvent.click(screen.getByText(/GameUpgradeButton\.cta/));

    await waitFor(() => {
      expect(client.createCheckoutSession).toHaveBeenCalled();
    });
    // No navigation occurred.
    expect(window.location.href).not.toBe("https://checkout.stripe.com/c/pay/cs_test_1");
  });
});