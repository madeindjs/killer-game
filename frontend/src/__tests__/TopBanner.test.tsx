import { render, screen } from "@testing-library/react";
import TopBanner from "@/app/[locale]/components/TopBanner";
import { usePathname } from "next/navigation";

describe("TopBanner", () => {
  afterEach(() => {
    vi.mocked(usePathname).mockReset();
  });

  it("renders the team building banner on the homepage", () => {
    vi.mocked(usePathname).mockReturnValue("/en");

    render(<TopBanner />);

    expect(screen.getByText("homeBanner.text")).toBeInTheDocument();
    expect(screen.getByText("homeBanner.cta →")).toBeInTheDocument();
  });

  it("renders on the games list page", () => {
    vi.mocked(usePathname).mockReturnValue("/en/games");

    render(<TopBanner />);

    expect(screen.getByText("homeBanner.text")).toBeInTheDocument();
  });

  it("is hidden on a game dashboard page", () => {
    vi.mocked(usePathname).mockReturnValue("/en/games/42");

    render(<TopBanner />);

    expect(screen.queryByText("homeBanner.text")).not.toBeInTheDocument();
  });

  it("is hidden on a player page", () => {
    vi.mocked(usePathname).mockReturnValue("/en/games/42/players/7");

    render(<TopBanner />);

    expect(screen.queryByText("homeBanner.text")).not.toBeInTheDocument();
  });
});
