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
});