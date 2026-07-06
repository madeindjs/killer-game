import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import B2BLeadForm from "@/components/organisms/B2BLeadForm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("B2BLeadForm", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  function mockFetchOk() {
    global.fetch = vi.fn(async () =>
      ({
        ok: true,
        status: 200,
        json: async () => ({ ok: true }),
      } as Response),
    ) as unknown as typeof fetch;
  }

  function mockFetchError(status: number, body: unknown) {
    global.fetch = vi.fn(async () =>
      ({
        ok: false,
        status,
        json: async () => body,
      } as Response),
    ) as unknown as typeof fetch;
  }

  async function fillForm(user: ReturnType<typeof userEvent.setup>) {
    await user.type(
      screen.getByPlaceholderText(/emailPlaceholder/),
      "alice@corp.com",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: /companySize/ }),
      "s3",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: /eventType/ }),
      "seminar",
    );
  }

  it("renders the form with required fields", () => {
    render(<B2BLeadForm />);
    expect(
      screen.getByPlaceholderText(/emailPlaceholder/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /companySize/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /eventType/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^submit$/ }),
    ).toBeInTheDocument();
  });

  it("submits a valid lead and shows the success message", async () => {
    mockFetchOk();
    const user = userEvent.setup();
    render(<B2BLeadForm />);

    await fillForm(user);
    await user.click(
      screen.getByRole("button", { name: /^submit$/ }),
    );

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = (global.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe("/api/leads");
    expect(init).toMatchObject({ method: "POST" });
    expect(
      await screen.findByTestId("b2b-lead-success"),
    ).toBeInTheDocument();
  });

  it("shows a field error when the server rejects a missing email", async () => {
    mockFetchError(400, { error: "emailInvalid" });
    const user = userEvent.setup();
    render(<B2BLeadForm />);

    await fillForm(user);
    await user.click(
      screen.getByRole("button", { name: /^submit$/ }),
    );

    expect(
      await screen.findByText(/validation\.emailInvalid/),
    ).toBeInTheDocument();
  });

  it("shows a generic error when the server returns 500", async () => {
    mockFetchError(500, { error: "server" });
    const user = userEvent.setup();
    render(<B2BLeadForm />);

    await fillForm(user);
    await user.click(
      screen.getByRole("button", { name: /^submit$/ }),
    );

    expect(await screen.findByText(/^error$/)).toBeInTheDocument();
  });
});