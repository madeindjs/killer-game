import { fillHydrated } from "../fixtures/hydration.ts";
import { expect, test } from "../fixtures/test.ts";
import { GameDashboardPage } from "../pages/game-dashboard.page.ts";
import { JoinPage, PlayerDashboardPage } from "../pages/player.page.ts";
import { urls } from "../pages/urls.ts";

/**
 * Real-time features (server-sent events): the organizer and the
 * participants each use their own device (browser context).
 */
test.describe("Real-time waiting room", () => {
  test("the organizer sees participants join and connect live", async ({ page, api, newDevice }) => {
    const game = await api.createGame("realtime-join");
    await api.addPlayer(game, "Alice");

    const organizer = await new GameDashboardPage(page).goto(game);
    await expect(organizer.avatar("Alice")).toBeVisible();
    await expect(organizer.connectedBadge).toHaveText("0/1 connected");

    // a participant opens the invitation on their phone
    const phone = await newDevice();
    await phone.goto(urls.invite(game));
    const player = await new JoinPage(phone).join("Bob");
    await expect(player.waitingRoom).toBeVisible();

    // no reload on the organizer side
    await expect(organizer.toast("Bob joined the game.")).toBeVisible();
    await expect(organizer.avatar("Bob")).toBeVisible();
    await expect(organizer.connectedIndicator("Bob")).toBeVisible();
    await expect(organizer.connectedBadge).toHaveText("1/2 connected");

    // the participant leaves: presence goes down
    await phone.context().close();
    await expect(organizer.connectedBadge).toHaveText("0/2 connected");
  });

  test("participants in the waiting room see each other arrive", async ({ api, newDevice }) => {
    const game = await api.createGame("realtime-lobby");

    const alicePage = await newDevice();
    await alicePage.goto(urls.invite(game));
    const alice = await new JoinPage(alicePage).join("Alice");
    await expect(alice.lobbyCount).toHaveText("1 player is in the lobby.");

    const bobPage = await newDevice();
    await bobPage.goto(urls.invite(game));
    await new JoinPage(bobPage).join("Bob");

    await expect(alice.lobbyCount).toHaveText("2 players are in the lobby.");
    await expect(alice.toast("Bob joined the game.")).toBeVisible();
  });

  test("a participant renaming themselves is reflected on the organizer dashboard", async ({
    page,
    api,
    newDevice,
  }) => {
    const game = await api.createGame("realtime-rename");
    const [alice] = await api.addPlayers(game, ["Alice", "Bob"]);

    const organizer = await new GameDashboardPage(page).goto(game);
    await expect(organizer.avatar("Alice")).toBeVisible();

    const phone = await newDevice();
    await phone.goto(urls.player(game, alice));
    const player = new PlayerDashboardPage(phone);
    await expect(player.waitingRoom).toBeVisible();
    await fillHydrated(phone.getByLabel("Name of the player"), "Alicia");

    await expect(organizer.avatar("Alicia")).toBeVisible();
    await expect.poll(async () => (await api.fetchPlayer(alice)).name).toBe("Alicia");
  });

  test("starting the game reveals each participant's mission without reloading", async ({
    page,
    api,
    newDevice,
  }) => {
    const game = await api.createGame("realtime-start");
    const [alice, bob] = await api.addPlayers(game, ["Alice", "Bob"]);

    const alicePage = await newDevice();
    await alicePage.goto(urls.player(game, alice));
    const aliceDashboard = new PlayerDashboardPage(alicePage);
    await expect(aliceDashboard.waitingRoom).toBeVisible();

    const organizer = await new GameDashboardPage(page).goto(game);
    await expect(organizer.connectedBadge).toHaveText("1/2 connected");
    await organizer.start();

    await expect(aliceDashboard.mission).toBeVisible();
    // with two players, each one must kill the other
    await expect(aliceDashboard.missionCard).toContainText("Bob");
    await expect(aliceDashboard.missionCard).toContainText(bob.action);

    const started = await api.fetchGame(game);
    expect(started.started_at).toBeTruthy();
  });
});
