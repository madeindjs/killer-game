import { expect, type Locator, type Page } from "@playwright/test";
import { fillHydrated, waitForHydration } from "../fixtures/hydration.ts";

/** Join page: `/en/games/:id/join` (reached through the `/join/:slug` invitation). */
export class JoinPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get submit(): Locator {
    return this.page.getByRole("button", { name: "Create the player" });
  }

  get nameInput(): Locator {
    return this.page.getByLabel("Name of the player");
  }

  /** Fill the form and submit: lands on the player's private dashboard. */
  async join(name: string): Promise<PlayerDashboardPage> {
    await fillHydrated(this.nameInput, name);
    await waitForHydration(this.submit);
    await this.submit.click();
    await this.page.waitForURL(/\/games\/[^/]+\/players\/[^/?]+\?password=/);
    return new PlayerDashboardPage(this.page);
  }
}

/** Player's private dashboard: `/en/games/:gameId/players/:playerId?password=:private_token`. */
export class PlayerDashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Waiting room, shown until the organizer starts the game. */
  get waitingRoom(): Locator {
    return this.page.getByRole("heading", { name: /You are in! Waiting for the launch/ });
  }

  get lobbyCount(): Locator {
    return this.page.getByText(/players? (is|are) in the lobby\./);
  }

  get mission(): Locator {
    return this.page.getByRole("heading", { name: "Your current mission" });
  }

  /** Card describing the current target and the action to perform. */
  get missionCard(): Locator {
    return this.page.locator(".card").filter({ has: this.mission });
  }

  get killedMessage(): Locator {
    return this.page.getByRole("heading", { name: "Oh no! You were killed!" });
  }

  get finished(): Locator {
    return this.page.getByRole("heading", { name: "The game finished." });
  }

  get eliminationToken(): Locator {
    return this.page.getByText("My elimination token");
  }

  toast(text: string | RegExp): Locator {
    return this.page.locator(".toast .alert").filter({ hasText: text }).first();
  }

  /** Credentials of the player, read from the dashboard URL. */
  credentials(): { gameId: string; playerId: string; privateToken: string } {
    const url = new URL(this.page.url());
    const match = /\/games\/([^/]+)\/players\/([^/]+)/.exec(url.pathname);
    if (!match) throw new Error(`Not a player dashboard URL: ${url}`);
    return { gameId: match[1], playerId: match[2], privateToken: url.searchParams.get("password") ?? "" };
  }

  /**
   * URL encoded in the "elimination" QR code, which the killer scans to
   * confirm the kill (`/en/games/:id/players/:id/kill?password=:kill_token`).
   */
  async killUrl(): Promise<string> {
    await waitForHydration(this.eliminationToken);
    await this.eliminationToken.click();
    const link = this.page.locator('a[href*="/kill?password="]').first();
    await expect(link).toBeVisible();
    const href = await link.getAttribute("href");
    if (!href) throw new Error("No kill link found");
    return href;
  }
}

/** Kill confirmation page, opened by the killer after scanning the target's QR code. */
export class KillPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get confirm(): Locator {
    return this.page.getByRole("button", { name: "Confirm the kill!" });
  }

  get success(): Locator {
    return this.page.getByText("Well done. You can go back to your dashboard and check your next target.");
  }

  get error(): Locator {
    return this.page.getByText("Something went wrong. Maybe the link is malformed or the player is already dead.");
  }

  async kill(): Promise<void> {
    await waitForHydration(this.confirm);
    await this.confirm.click();
  }
}
