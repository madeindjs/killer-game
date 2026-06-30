import { render, screen } from "@testing-library/react";
import AiDocsPage from "@/app/[locale]/docs/ai/page";

describe("AiDocsPage", () => {
  it("renders the AI / MCP docs page without crashing", () => {
    render(<AiDocsPage />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
