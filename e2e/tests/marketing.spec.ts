import { fillHydrated, waitForHydration } from "../fixtures/hydration.ts";
import { DEV_ONLY, expect, test } from "../fixtures/test.ts";

test.describe("Landing page", () => {
  test("presents the game, how it works, stats and testimonials", async ({ page }) => {
    await page.goto("/en");

    await expect(page).toHaveTitle(/Killer game/);
    await expect(page.getByRole("heading", { level: 1, name: "Killer game generator" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Create a game" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Create the game" })).toBeVisible();

    await expect(page.getByRole("heading", { name: "How does it work?" })).toBeVisible();
    await expect(page.getByTestId("how-it-works-step").first()).toBeAttached();

    // statistics are loaded from the API
    const stats = page.getByText("Players eliminated", { exact: true });
    await stats.scrollIntoViewIfNeeded();
    await expect(stats).toBeVisible();
    await expect(page.getByText("Loading...")).toHaveCount(0);

    await expect(page.getByRole("heading", { name: "Testimonials" })).toBeVisible();
  });

  test("links to the secondary pages from the footer", async ({ page }) => {
    await page.goto("/en");
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: "How does the killer game work?" })).toHaveAttribute("href", /\/en\/help$/);
    await expect(footer.getByRole("link", { name: "Action list for a game of Killer" })).toHaveAttribute("href", /\/en\/actions$/);
    await expect(footer.getByRole("link", { name: "Team building & seminars" })).toHaveAttribute("href", /\/en\/team-building$/);
    await expect(footer.getByRole("link", { name: "AI / MCP setup" })).toHaveAttribute("href", /\/en\/docs\/ai$/);
  });
});

test.describe("Content pages", () => {
  const pages = [
    { path: "/en/help", heading: "How does the killer game work?" },
    { path: "/en/actions", heading: "Action list for a game of Killer" },
    { path: "/en/team-building", heading: /Team building & seminar animation/ },
    { path: "/en/docs/ai", heading: "AI & MCP integration" },
  ];

  for (const { path, heading } of pages) {
    test(`${path} renders`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.ok()).toBe(true);
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    });
  }

  test("/en/actions lists action ideas and lets you create a game", async ({ page }) => {
    await page.goto("/en/actions");
    await expect(page.getByRole("button", { name: "Create the game" })).toBeVisible();
    await expect(page.getByRole("listitem").first()).toBeVisible();
  });

  test("unknown pages answer with a 404", async ({ page }) => {
    const res = await page.goto("/en/this-page-does-not-exist-e2e");
    expect(res?.status()).toBe(404);
    await expect(page.getByText(/could not be found|not found/i).first()).toBeVisible();
  });
});

test.describe("SEO & AI discovery files", () => {
  const files = [
    { path: "/robots.txt", contentType: /text\/plain/, contains: "Sitemap" },
    { path: "/sitemap.xml", contentType: /xml/, contains: "<urlset" },
    { path: "/llms.txt", contentType: /text\/plain/, contains: "Killer" },
    { path: "/ai.txt", contentType: /text\/plain/, contains: "" },
  ];

  for (const { path, contentType, contains } of files) {
    test(`${path} is served`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toMatch(contentType);
      expect(await res.text()).toContain(contains);
    });
  }
});

test.describe("Team building lead form", () => {
  // sends a real lead to the sales Matrix room when MATRIX_ACCESS_TOKEN is set
  test("submits a lead", { tag: DEV_ONLY }, async ({ page }) => {
    await page.goto("/en/team-building");
    const form = page.getByTestId("b2b-lead-form");
    await form.scrollIntoViewIfNeeded();

    await fillHydrated(form.getByLabel("Work email"), "e2e@example.com");
    await form.getByLabel("Company size").selectOption({ label: "11–50" });
    await form.getByLabel("Event type").selectOption({ label: "Seminar" });
    await fillHydrated(form.getByLabel("Message (optional)"), "[E2E] automated test, please ignore");

    const submit = form.getByRole("button", { name: "Send my request" });
    await waitForHydration(submit);
    const response = page.waitForResponse((r) => r.url().endsWith("/api/leads"));
    await submit.click();

    expect((await response).ok()).toBe(true);
    await expect(page.getByTestId("b2b-lead-success")).toBeVisible();
  });

  test("validates the lead form", async ({ page }) => {
    await page.goto("/en/team-building");
    const form = page.getByTestId("b2b-lead-form");
    await form.scrollIntoViewIfNeeded();

    // validated server-side: an invalid lead is rejected before being sent anywhere
    const submit = form.getByRole("button", { name: "Send my request" });
    await waitForHydration(submit);
    const response = page.waitForResponse((r) => r.url().endsWith("/api/leads"));
    await submit.click();

    expect((await response).status()).toBe(400);
    await expect(form.getByText("A work email is required.")).toBeVisible();
    await expect(page.getByTestId("b2b-lead-success")).toHaveCount(0);
  });
});
