import { render, screen } from "@testing-library/react";
import TeamBuildingPage from "@/app/[locale]/team-building/page";

describe("TeamBuildingPage", () => {
  it("renders the B2B page with a level-1 heading", async () => {
    const element = await TeamBuildingPage({
      params: Promise.resolve({ locale: "en" }),
    });
    render(element);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders the lead form section", async () => {
    const element = await TeamBuildingPage({
      params: Promise.resolve({ locale: "en" }),
    });
    render(element);
    expect(screen.getByTestId("b2b-lead-form")).toBeInTheDocument();
  });
});