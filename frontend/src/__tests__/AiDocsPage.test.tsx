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
describe("AiDocsPage tools", () => {
  it("documents the gameplay and discovery tools", async () => {
    const element = await AiDocsPage({
      params: Promise.resolve({ locale: "en" }),
    });
    render(element);

    for (const tool of ["list_games", "finish_game", "eliminate_player"]) {
      expect(screen.getByText(tool)).toBeInTheDocument();
    }
  });
});
