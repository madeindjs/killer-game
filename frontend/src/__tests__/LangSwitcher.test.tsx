import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as navigation from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LangSwitcher from "@/app/[locale]/components/LangSwitcher";

describe("LangSwitcher", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(navigation.useRouter).mockReturnValue({
      push: mockPush,
      prefetch: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    });
  });

  it("renders a single touch-friendly select with both locales", () => {
    render(<LangSwitcher />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    // The select must be tall enough to be a 44px touch target on mobile.
    expect(select.className).toMatch(/min-h-\[2\.75rem\]/);
    expect(screen.getByText("🇫🇷")).toBeInTheDocument();
    expect(screen.getByText("🇬🇧")).toBeInTheDocument();
  });

  it("navigates to the French locale when 🇫🇷 is selected", async () => {
    const user = userEvent.setup();
    render(<LangSwitcher />);

    await user.selectOptions(screen.getByRole("combobox"), "fr");
    expect(mockPush).toHaveBeenCalledWith("/fr");
  });

  it("navigates to the English locale when 🇬🇧 is selected", async () => {
    const user = userEvent.setup();
    render(<LangSwitcher />);

    await user.selectOptions(screen.getByRole("combobox"), "en");
    expect(mockPush).toHaveBeenCalledWith("/en");
  });

  it("does not render the legacy dropdown details element", () => {
    const { container } = render(<LangSwitcher />);
    expect(container.querySelector("details")).toBeNull();
  });
});