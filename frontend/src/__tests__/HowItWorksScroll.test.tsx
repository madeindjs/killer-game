import { render, screen } from "@testing-library/react";
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
});
