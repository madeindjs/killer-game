import db from "@/lib/drizzle/database.mjs";
import { GameActions, Games, Players } from "@/lib/drizzle/schema.mjs";
import { anonymizePlayer } from "@/utils/player.server";
import { and, eq } from "drizzle-orm";

/**
 * @param {Request} req
 */
export async function GET(req, { params }) {
  const [game] = await db.select().from(Games).where(eq(Games.id, params.gameId)).limit(1);

  if (game === undefined) return new Response(null, { status: 404 });

  const isAdmin = game.privateToken === String(req.headers.get("authorization"));

  const [authorizedPlayer] = await db
    .select({ id: Players.id })
    .from(Players)
    .where(and(eq(Players.privateToken, authorizationToken), eq(Players.gameId, game.id)))
    .limit(1);

  /**
   * @param {import("drizzle-orm").InferSelectModel<typeof Players>} player
   */
  function canDisplayPlayer(player) {
    if (game.finishedAt) return true;
    if (isAdmin) return true;
    if (player.id === authorizedPlayer?.id) return true;
    if (player.killedBy === authorizedPlayer?.id) return true;
    return false;
  }

  const players = await db.select().from(Players).where(eq(Players.gameId, game.id));

  /** @type {import("@killer-game/types").GameDashboard} */
  const gameStatus = { podium: [], events: [] };

  for (const player of players) {
    const kills = await db
      .select()
      .from(Players)
      .where(and(eq(Players.killedBy, player.id), eq(Players.gameId, game.id)));

    gameStatus.podium.push({
      player: canDisplayPlayer(player) ? player : anonymizePlayer(player),
      kills: kills.map((p) => (canDisplayPlayer(p) ? p : anonymizePlayer(p))),
    });
  }

  /**
   * @param {string | null} playerId
   * @returns {import("drizzle-orm").InferSelectModel<typeof Players>}
   */
  function findPlayer(playerId) {
    const player = players.find(({ id }) => id === playerId);

    return canDisplayPlayer(player) ? player : anonymizePlayer(player);
  }

  gameStatus.podium.sort((a, b) => {
    const res = b.kills.length - a.kills.length;
    if (res !== 0) return res;

    return a.player.killed_at ? 1 : -1;
  });

  const actions = await db.select().from(GameActions).where(eq(GameActions.gameId, game.id));
  // @ts-ignore
  gameStatus.events = players
    .filter((p) => p.killed_by)
    .map((target) => ({
      action: findAction(target.actionId),
      target: canDisplayPlayer(target) ? target : container.playerService.anonymize(target),
      player: findPlayer(target.killedBy),
      at: target.killedAt,
    }))
    .sort((a, b) => new Date(String(b.at)).getTime() - new Date(String(a.at)).getTime());

  return Response.json({ data: gameStatus });
}
