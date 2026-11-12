import { render, screen, within } from "@testing-library/react";
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

  it("hides the sticky scrub panel on small viewports", () => {
    render(<HowItWorksScroll />);

    expect(screen.getByTestId("how-it-works-sticky-panel")).toHaveClass(
      "hidden",
    );
    expect(screen.getByTestId("how-it-works-sticky-panel")).toHaveClass(
      "lg:block",
    );
  });

  it("renders an inline visual panel per step for small viewports", () => {
    render(<HowItWorksScroll />);

    const panels = screen.getAllByTestId("how-it-works-inline-panel");
    expect(panels).toHaveLength(4);

    // Step 2 panel (index 1): all players alive, all crosses hidden
    const step2Crosses = within(panels[1]!).getAllByTestId(
      "eliminated-cross",
    );
    step2Crosses.forEach((cross) => expect(cross).toHaveClass("opacity-0"));

    // Step 3 panel (index 2): Alice eliminated, exactly one cross visible
    const step3Crosses = within(panels[2]!).getAllByTestId(
      "eliminated-cross",
    );
    expect(
      step3Crosses.filter((cross) => cross.className.includes("opacity-100")),
    ).toHaveLength(1);

    // Step 4 panel (index 3): podium visible
    expect(
      within(panels[3]!).getAllByTestId("how-it-works-inline-podium").length,
    ).toBeGreaterThan(0);
  });

  it("does not apply step min-height on small viewports", () => {
    render(<HowItWorksScroll />);

    const stepBlocks = screen.getAllByTestId("how-it-works-step");
    stepBlocks.forEach((block) => {
      const minHeights = block.className
        .split(" ")
        .filter((cls) => cls.includes("min-h-"));
      expect(minHeights).toEqual(["lg:min-h-[70vh]"]);
    });
  });
});
