import type { PlayerRecord } from "@killer-game/types";
import { expect, test } from "../fixtures/test.ts";
import { GameDashboardPage } from "../pages/game-dashboard.page.ts";
import { KillPage, PlayerDashboardPage } from "../pages/player.page.ts";
import { urls } from "../pages/urls.ts";

test.describe("Starting the game (organizer)", () => {
  test("cannot start a game with fewer than two players", async ({ page, api }) => {
    const game = await api.createGame("start-alone");
    await api.addPlayer(game, "Alice");

    const dashboard = await new GameDashboardPage(page).goto(game);
    await expect(dashboard.startButton).toBeDisabled();
  });

  test("the start modal lists every player's private link, then the game can be paused", async ({ page, api }) => {
    const game = await api.createGame("start-modal");
    const players = await api.addPlayers(game, ["Alice", "Bob", "Carol"]);

    const dashboard = await new GameDashboardPage(page).goto(game);
    await dashboard.startButton.click();

    const dialog = dashboard.dialog;
    for (const player of players) {
      await expect(dialog.getByLabel(`Link ${player.name}`)).toHaveValue(
        new RegExp(`/en/games/[^/]+/players/${player.id}\\?password=${player.private_token}$`),
      );
    }

    await dialog.getByLabel(/Shuffle the order of the players/).check();
    await dialog.getByRole("button", { name: "Yes, I want to start the game" }).click();

    await expect(dashboard.stopButton).toBeVisible();
    await expect(dashboard.toast("The game was started.")).toBeVisible();
    await expect.poll(async () => (await api.fetchGame(game)).started_at).toBeTruthy();

    // pause
    await dashboard.stopButton.click();
    await expect(dashboard.startButton).toBeVisible();
    await expect(dashboard.toast("The game was paused.")).toBeVisible();
    await expect.poll(async () => (await api.fetchGame(game)).started_at).toBeFalsy();
  });
});

test.describe("Playing the game (participants)", () => {
  /** Players in chain order, starting from `first`: each one must kill the next. */
  async function chainFrom(
    api: { fetchTarget: (p: PlayerRecord) => Promise<{ id: string }> },
    players: PlayerRecord[],
    first: PlayerRecord,
  ): Promise<PlayerRecord[]> {
    const chain = [first];
    while (chain.length < players.length) {
      const target = await api.fetchTarget(chain[chain.length - 1]);
      chain.push(players.find((p) => p.id === target.id)!);
    }
    return chain;
  }

  test("eliminations through the QR code until the last player standing wins", async ({
    page,
    api,
    newDevice,
  }) => {
    const game = await api.createGame("full-game");
    const players = await api.addPlayers(game, ["Alice", "Bob", "Carol"]);
    await api.startGame(game);

    const [killer, firstVictim, secondVictim] = await chainFrom(api, players, players[0]);

    // every participant on their own phone
    const killerPage = await newDevice();
    await killerPage.goto(urls.player(game, killer));
    const killerDashboard = new PlayerDashboardPage(killerPage);
    await expect(killerDashboard.mission).toBeVisible();
    await expect(killerDashboard.missionCard).toContainText(firstVictim.name);
    await expect(killerDashboard.missionCard).toContainText(firstVictim.action);

    const victimPage = await newDevice();
    await victimPage.goto(urls.player(game, firstVictim));
    const victimDashboard = new PlayerDashboardPage(victimPage);
    await expect(victimDashboard.mission).toBeVisible();

    // the victim shows their QR code, the killer scans it
    const killUrl = await victimDashboard.killUrl();
    await killerPage.goto(killUrl);
    await expect(killerPage.getByRole("heading", { name: /You are killing/ })).toContainText(firstVictim.name);
    const killPage = new KillPage(killerPage);
    await killPage.kill();
    await expect(killPage.success).toBeVisible();

    // the victim is informed live
    await expect(victimDashboard.killedMessage).toBeVisible();

    // the killer inherits the victim's target
    await killerPage.goto(urls.player(game, killer));
    await expect(killerDashboard.missionCard).toContainText(secondVictim.name);
    await expect(killerDashboard.missionCard).toContainText(secondVictim.action);

    // the organizer sees the elimination in the events and the podium
    const organizer = await new GameDashboardPage(page).goto(game);
    await expect(page.getByText("Podium")).toBeVisible();
    await expect(page.getByText("Events")).toBeVisible();

    // last elimination: the game is over
    const lastVictimPage = await newDevice();
    await lastVictimPage.goto(urls.player(game, secondVictim));
    const lastKillUrl = await new PlayerDashboardPage(lastVictimPage).killUrl();
    await killerPage.goto(lastKillUrl);
    await new KillPage(killerPage).kill();
    await expect(new KillPage(killerPage).success).toBeVisible();

    await killerPage.goto(urls.player(game, killer));
    await expect(killerDashboard.finished).toBeVisible();
    await expect(killerPage.getByText("You killed")).toBeVisible();

    await expect.poll(async () => (await api.fetchGame(game)).finished_at).toBeTruthy();
    await organizer.page.reload();
    await expect(organizer.stopButton.or(organizer.startButton)).toBeDisabled();
  });

  test("a kill link can only be used once and must be valid", async ({ api, newDevice }) => {
    const game = await api.createGame("kill-token");
    const players = await api.addPlayers(game, ["Alice", "Bob", "Carol"]);
    await api.startGame(game);
    const [, victim] = await chainFrom(api, players, players[0]);
    const victimRecord = await api.fetchPlayer(victim);

    const killerPage = await newDevice();
    const killPage = new KillPage(killerPage);

    // forged token
    await killerPage.goto(urls.playerKill(game, { ...victimRecord, kill_token: 1 }));
    await killPage.kill();
    await expect(killPage.error).toBeVisible();

    // valid token, used twice
    await killerPage.goto(urls.playerKill(game, victimRecord));
    await killPage.kill();
    await expect(killPage.success).toBeVisible();

    await killerPage.goto(urls.playerKill(game, victimRecord));
    await killPage.kill();
    await expect(killPage.error).toBeVisible();
  });
});
