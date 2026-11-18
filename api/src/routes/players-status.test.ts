import assert from "node:assert";
import { after, before, describe, it } from "node:test";
import type { GameRecord, PlayerRecord, PlayerStatus } from "@killer-game/types";
import { useServer, type UseServerReturn } from "../server.ts";
import { getPlayersStatusRoute } from "./players-status.ts";

describe(getPlayersStatusRoute.name, () => {
  let server: UseServerReturn;
  let game: GameRecord;
  let player: PlayerRecord;
  let player2: PlayerRecord;

  before(async () => {
    server = await useServer("test");
    await server.container.db.migrate.latest();
    game = await server.container.gameService.create({ name: "test" });
    player = await server.container.playerService.create({ name: "test", game_id: game.id, action: "Test" });
    player2 = await server.container.playerService.create({ name: "test 2", game_id: game.id, action: "Test 2" });
  });

  after(async () => {
    await server.close();
  });

  async function fetchStatus(token: string) {
    return server.server.inject({
      method: "GET",
      url: `/players/${player.id}/status`,
      headers: { authorization: token },
    });
  }

  it("should not show without auth", async () => {
    const res = await fetchStatus(player.private_token + 1);
    assert.strictEqual(res.statusCode, 403);
  });

  it("should hide the target while the game is not started", async () => {
    const res = await fetchStatus(player.private_token);

    assert.strictEqual(res.statusCode, 200);
    const status: PlayerStatus = res.json().data;
    assert.deepEqual(status.current, {});
    assert.deepEqual(status.kills, []);
  });

  it("should reveal the target once the game is started", async () => {
    await server.container.gameService.update({ ...game, started_at: new Date().toISOString() });

    const res = await fetchStatus(player.private_token);

    assert.strictEqual(res.statusCode, 200);
    const status: PlayerStatus = res.json().data;
    assert.equal(status.current.player?.id, player2.id);
    assert.equal(status.current.action, player2.action);
  });
});
