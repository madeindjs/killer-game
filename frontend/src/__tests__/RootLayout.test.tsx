import { render, screen, within } from "@testing-library/react";
import RootLayout from "@/app/[locale]/layout";
import type { ReactNode } from "react";

describe("RootLayout", () => {
  it("renders the top banner inside the NextIntlClientProvider", async () => {
    const layout = await RootLayout({
      children: <p>page-content</p>,
      params: Promise.resolve({ locale: "en" }),
    });

    render(layout);

    const provider = screen.getByTestId("next-intl-provider");
    expect(
      within(provider).getByText("homeBanner.text"),
    ).toBeInTheDocument();
  });

  it("renders the page content inside the NextIntlClientProvider", async () => {
    const layout = await RootLayout({
      children: <p>page-content</p>,
      params: Promise.resolve({ locale: "en" }),
    });

    render(layout);

    const provider = screen.getByTestId("next-intl-provider");
    expect(
      within(provider).getByText("page-content"),
    ).toBeInTheDocument();
  });

  it("renders the top banner before the navbar", async () => {
    const layout = await RootLayout({
      children: <p>page-content</p>,
      params: Promise.resolve({ locale: "en" }),
    });

    const { container } = render(layout);

    const banner = screen.getByText("homeBanner.text").closest("div");
    const navbar = screen.getByText("NavBar.games").closest("div");
    expect(banner).not.toBeNull();
    expect(navbar).not.toBeNull();
    expect(banner!.compareDocumentPosition(navbar!)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
});
