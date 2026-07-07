import React from "react";
import { render, screen, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TimeSinceStartedCountDown } from "@/components/molecules/TimeSinceStartedCountDown";

describe("TimeSinceStartedCountDown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps the DaisyUI countdown visual but exposes a single aria-label", () => {
    const startedAt = new Date(Date.now() - 0).toISOString();
    render(<TimeSinceStartedCountDown startedAt={startedAt} />);

    // The decorative DaisyUI countdown spans (with --value) are preserved.
    const timer = screen.getByRole("timer");
    expect(timer).toHaveClass("countdown");
    expect(timer).toHaveAttribute("aria-live", "polite");
    // The whole component is summarized for screen readers by one label,
    // instead of leaking all 100 hidden scroll-picker values per unit.
    expect(timer).toHaveAttribute("aria-label", "00h 00m 00s");
  });

  it("ticks forward each second and updates the aria-label", () => {
    const startedAt = new Date(Date.now() - 1000).toISOString();
    render(<TimeSinceStartedCountDown startedAt={startedAt} />);

    const timer = screen.getByRole("timer");
    expect(timer).toHaveAttribute("aria-label", "00h 00m 01s");

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(timer).toHaveAttribute("aria-label", "00h 00m 03s");
  });

  it("stops updating when stop is true (paused / finished game)", () => {
    const startedAt = new Date(Date.now() - 5000).toISOString();
    render(<TimeSinceStartedCountDown startedAt={startedAt} stop />);

    const timer = screen.getByRole("timer");
    const before = timer.getAttribute("aria-label");

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(timer.getAttribute("aria-label")).toBe(before);
  });
});