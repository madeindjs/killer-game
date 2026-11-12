import { render, screen } from "@testing-library/react";
import HelpPage from "@/app/[locale]/help/page";

describe("HelpPage", () => {
  it("renders the scroll-driven tutorial steps", async () => {
    const element = await HelpPage({
      params: Promise.resolve({ locale: "en" }),
    });
    render(element);

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

    // Unique to HowItWorksScroll: sticky scrub panel and 4th player "Jean"
    expect(
      screen.getByTestId("how-it-works-sticky-panel"),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Jean").length).toBeGreaterThan(0);
  });

  it("renders the help headline", async () => {
    const element = await HelpPage({
      params: Promise.resolve({ locale: "en" }),
    });
    render(element);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText("headline")).toBeInTheDocument();
  });
});
