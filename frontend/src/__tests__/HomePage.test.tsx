import { render, screen } from "@testing-library/react";
import HomePage from "@/app/[locale]/page";

describe("HomePage", () => {
  it("renders the homepage without crashing", async () => {
    const element = await HomePage({
      params: Promise.resolve({ locale: "en" }),
    });
    render(element);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders the tutorial example headings", async () => {
    const element = await HomePage({
      params: Promise.resolve({ locale: "en" }),
    });
    render(element);
    expect(screen.getByRole("heading", { name: "step1.title" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "step2.title" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "step3.title" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "step4.title" })).toBeInTheDocument();
  });

  it("renders the stats section after the how-does-it-work section", async () => {
    const element = await HomePage({
      params: Promise.resolve({ locale: "en" }),
    });
    render(element);

    const howDoesItWork = screen.getByRole("heading", {
      name: "HowDoesItWork.title",
    });
    const stats = await screen.findByText("gamesCreated");

    expect(howDoesItWork.compareDocumentPosition(stats)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
});