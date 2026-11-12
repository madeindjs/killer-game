import { render, screen } from "@testing-library/react";
import { act } from "react";
import HowItWorksScroll from "@/components/organisms/HowItWorksScroll";

describe("HowItWorksScroll", () => {
  it("renders the 4 step headings", () => {
    render(<HowItWorksScroll />);

    expect(
      screen.getByRole("heading", { name: "step1.title" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "step2.title" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "step3.title" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "step4.title" }),
    ).toBeInTheDocument();
  });

  it("shows the 4 player avatars with their names", () => {
    render(<HowItWorksScroll />);

    expect(screen.getAllByText("Bob").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Alice").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Luc").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Jean").length).toBeGreaterThan(0);
  });

  it("hides the timeline and the podium at step 0", () => {
    render(<HowItWorksScroll />);

    expect(screen.getByTestId("how-it-works-timeline")).toHaveClass(
      "opacity-0",
    );
    expect(screen.getByTestId("how-it-works-podium")).toHaveClass("opacity-0");
  });

  it("highlights the first step dot at step 0", () => {
    render(<HowItWorksScroll />);

    const dots = screen.getAllByTestId("step-dot");
    expect(dots).toHaveLength(4);
    expect(dots[0]).toHaveClass("bg-primary");
    expect(dots[1]).toHaveClass("bg-base-300");
  });

  it("keeps the scrub panel sticky on small viewports", () => {
    render(<HowItWorksScroll />);

    const panel = screen.getByTestId("how-it-works-sticky-panel");
    expect(panel).toHaveClass("sticky");
    expect(panel).toHaveClass("top-2");
    expect(panel).toHaveClass("lg:top-24");
    expect(panel).toHaveClass("max-h-[70vh]");
  });

  it("does not render per-step inline panels", () => {
    render(<HowItWorksScroll />);

    expect(
      screen.queryByTestId("how-it-works-inline-panel"),
    ).not.toBeInTheDocument();
  });

  it("reserves scroll height for the steps on all viewports", () => {
    render(<HowItWorksScroll />);

    const stepBlocks = screen.getAllByTestId("how-it-works-step");
    stepBlocks.forEach((block) => {
      expect(block).toHaveClass("min-h-[60vh]");
      expect(block).toHaveClass("lg:min-h-[70vh]");
    });
  });

  describe("timeline visibility per viewport", () => {
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

    // jsdom viewport is 768px, section is 2000px -> scrollable = 1232
    function scrubToStep(container: HTMLElement, step: number) {
      const top = -(1232 / 4) * step;
      container.firstElementChild!.getBoundingClientRect = () =>
        makeRect({ top, height: 2000 });
      act(() => {
        window.dispatchEvent(new window.Event("scroll"));
      });
    }

    function stubSmallViewport() {
      vi.stubGlobal("matchMedia", () => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
    }

    beforeEach(() => {
      vi.stubGlobal("requestAnimationFrame", (cb: (time: number) => void) => {
        cb(0);
        return 1;
      });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("shows the timeline on step 2 for large screens", () => {
      const { container } = render(<HowItWorksScroll />);

      scrubToStep(container, 1);
      expect(screen.getByTestId("how-it-works-timeline")).toHaveClass(
        "opacity-100",
      );
    });

    it("removes the timeline on step 2 for small viewports", () => {
      stubSmallViewport();
      const { container } = render(<HowItWorksScroll />);

      scrubToStep(container, 1);
      expect(screen.getByTestId("how-it-works-timeline")).toHaveClass(
        "opacity-0",
      );
    });

    it("shows the timeline on step 3 for small viewports", () => {
      stubSmallViewport();
      const { container } = render(<HowItWorksScroll />);

      scrubToStep(container, 2);
      expect(screen.getByTestId("how-it-works-timeline")).toHaveClass(
        "opacity-100",
      );
    });
  });
});
