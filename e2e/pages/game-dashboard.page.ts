import { expect, type Locator, type Page } from "@playwright/test";
import { fillHydrated, waitForHydration } from "../fixtures/hydration.ts";
import { urls } from "./urls.ts";

/** Organizer's admin dashboard: `/en/games/:id?password=:private_token`. */
export class GameDashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(game: { id: string; private_token: string }): Promise<this> {
    await this.page.goto(urls.gameAdmin(game));
    return this;
  }

  get title(): Locator {
    return this.page.getByRole("heading", { level: 1 });
  }

  get inviteLink(): Locator {
    return this.page.getByLabel("Invitation link (one link for everyone)");
  }

  get startButton(): Locator {
    return this.page.getByRole("button", { name: /Start the game/ });
  }

  get stopButton(): Locator {
    return this.page.getByRole("button", { name: /Stop the game/ });
  }

  get editButton(): Locator {
    return this.page.getByRole("button", { name: /Edit the game/ });
  }

  get inviteButton(): Locator {
    return this.page.getByRole("button", { name: /Add a player/ });
  }

  get connectedBadge(): Locator {
    return this.page.getByText(/\d+\/\d+ connected/);
  }

  get dialog(): Locator {
    return this.page.locator("dialog[open]");
  }

  /** Avatar (rendered with the player's name as title) in the header avatar group. */
  avatar(name: string): Locator {
    return this.page.locator(`.avatar-group [title="${name}"]`);
  }

  /** Presence dot shown next to a connected player's avatar. */
  connectedIndicator(name: string): Locator {
    return this.page.getByRole("img", { name: `${name} is connected` }).first();
  }

  toast(text: string | RegExp): Locator {
    return this.page.locator(".toast .alert").filter({ hasText: text }).first();
  }

  /** Add a player with the form shown when the game has no players yet. */
  async addFirstPlayer(name: string, action?: string): Promise<void> {
    const form = this.page.locator("form").filter({ has: this.page.getByRole("button", { name: "Create the player" }) });
    await fillHydrated(form.getByLabel("Name of the player"), name);
    if (action) await fillHydrated(form.locator('input[name="action"]'), action);
    await form.getByRole("button", { name: "Create the player" }).click();
  }

  async start({ shuffle = false } = {}): Promise<void> {
    await waitForHydration(this.startButton);
    await this.startButton.click();
    const dialog = this.dialog;
    await expect(dialog).toBeVisible();
    if (shuffle) await dialog.getByLabel(/Shuffle the order of the players/).check();
    await dialog.getByRole("button", { name: "Yes, I want to start the game" }).click();
    await expect(this.stopButton).toBeVisible();
  }

  async openPlayer(name: string): Promise<Locator> {
    // timeline avatars open the player modal
    const avatar = this.page.locator(`[title="${name}"]`).last();
    await waitForHydration(avatar);
    await avatar.click();
    await expect(this.dialog.getByRole("heading", { name: "Edit the player" })).toBeVisible();
    return this.dialog;
  }
}
