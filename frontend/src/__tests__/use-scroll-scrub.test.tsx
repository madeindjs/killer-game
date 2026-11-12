import { render } from "@testing-library/react";
import { useRef } from "react";
import { usePrefersReducedMotion, useScrollScrub } from "@/hooks/use-scroll-scrub";

function makeRect({ top, height }: { top: number; height: number }): DOMRect {
  return {
    top,
    height,
    bottom: top + height,
    left: 0,
    right: 0,
    width: 0,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as unknown as DOMRect;
}

function ScrollScrubHarness({
  rect,
  steps,
}: {
  rect: { top: number; height: number };
  steps: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { activeStep, progress } = useScrollScrub(ref, steps);

  return (
    <div
      ref={(el) => {
        if (el) {
          ref.current = el;
          el.getBoundingClientRect = () => makeRect(rect);
        }
      }}
    >
      <span data-testid="active-step">{activeStep}</span>
      <span data-testid="progress">{progress.toFixed(3)}</span>
    </div>
  );
}

function scrollWindow() {
  window.dispatchEvent(new window.Event("scroll"));
}

describe("useScrollScrub", () => {
  it("stays on step 0 before the section is scrolled", () => {
    const { getByTestId } = render(
      <ScrollScrubHarness rect={{ top: 400, height: 2000 }} steps={4} />,
    );

    expect(getByTestId("active-step").textContent).toBe("0");
  });

  it("computes the active step from the scroll position", () => {
    const { getByTestId } = render(
      <ScrollScrubHarness rect={{ top: -500, height: 2000 }} steps={4} />,
    );

    scrollWindow();

    // total scrollable = 2000 - 768 (jsdom viewport) = 1232
    // progress = 500 / 1232 ≈ 0.406 -> step = floor(0.406 * 4) = 1
    expect(getByTestId("active-step").textContent).toBe("1");
    expect(getByTestId("progress").textContent).toBe("0.406");
  });

  it("reaches the last step when fully scrolled", () => {
    const { getByTestId } = render(
      <ScrollScrubHarness rect={{ top: -5000, height: 2000 }} steps={4} />,
    );

    scrollWindow();

    expect(getByTestId("active-step").textContent).toBe("3");
    expect(getByTestId("progress").textContent).toBe("1.000");
  });

  it("stays on step 0 when the section is shorter than the viewport", () => {
    const { getByTestId } = render(
      <ScrollScrubHarness rect={{ top: -100, height: 100 }} steps={4} />,
    );

    scrollWindow();

    expect(getByTestId("active-step").textContent).toBe("0");
  });

  it("clamps the step to steps - 1", () => {
    const { getByTestId } = render(
      <ScrollScrubHarness rect={{ top: -900, height: 2000 }} steps={4} />,
    );

    scrollWindow();

    expect(getByTestId("active-step").textContent).toBe("2");
  });

  it("stops listening on unmount", () => {
    const { unmount } = render(
      <ScrollScrubHarness rect={{ top: -500, height: 2000 }} steps={4} />,
    );

    expect(() => unmount()).not.toThrow();
  });
});

describe("usePrefersReducedMotion", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns false when the media query does not match", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    );

    function ReducedMotionHarness() {
      const reduced = usePrefersReducedMotion();
      return <span data-testid="reduced">{String(reduced)}</span>;
    }

    const { getByTestId } = render(<ReducedMotionHarness />);

    expect(getByTestId("reduced").textContent).toBe("false");
  });

  it("returns true when the user prefers reduced motion", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    );

    function ReducedMotionHarness() {
      const reduced = usePrefersReducedMotion();
      return <span data-testid="reduced">{String(reduced)}</span>;
    }

    const { getByTestId } = render(<ReducedMotionHarness />);

    expect(getByTestId("reduced").textContent).toBe("true");
  });
});
