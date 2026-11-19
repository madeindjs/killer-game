import React from "react";
import { render, screen } from "@testing-library/react";
import { useLocale } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import Footer from "@/app/[locale]/components/Footer";

// expose the `prefetch` prop of next/link
vi.mock("next/link", () => ({
  default: ({ href, prefetch, children, ...props }: React.ComponentProps<"a"> & { prefetch?: boolean }) => (
    <a href={String(href)} data-prefetch={String(prefetch)} {...props}>
      {children}
    </a>
  ),
}));

describe("Footer", () => {
  // Production builds prefetch visible links, and the i18n middleware answers
  // a prefetch of `/fr` with a `NEXT_LOCALE=fr` cookie: the next visit to `/`
  // would then be redirected to French although the user never chose it.
  it.each([
    ["en", "/fr"],
    ["fr", "/en"],
  ])("does not prefetch the other language from %s", (locale, href) => {
    vi.mocked(useLocale).mockReturnValue(locale);
    render(<Footer />);

    const link = screen.getByRole("link", { name: "Footer.switchLang" });
    expect(link).toHaveAttribute("href", href);
    expect(link).toHaveAttribute("data-prefetch", "false");
  });
});
