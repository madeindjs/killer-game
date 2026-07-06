import { render, screen } from "@testing-library/react";
import AiDocsPage from "@/app/[locale]/docs/ai/page";

describe("AiDocsPage", () => {
  it("renders the AI / MCP docs page without crashing", async () => {
    const element = await AiDocsPage({
      params: Promise.resolve({ locale: "en" }),
    });
    render(element);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});