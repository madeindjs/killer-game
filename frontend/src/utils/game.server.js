import db from "@/lib/drizzle/database.mjs";
import { GameActions, Players } from "@/lib/drizzle/schema.mjs";
import { and, count, eq, not, sql } from "drizzle-orm";

/**
 * @typedef {typeof import('@/lib/drizzle/schema.mjs').Games} Games
 * @param {import("drizzle-orm").InferSelectModel<Games>} game
 */
export function sanitizeGame(game) {
  return {
    id: game.id,
    name: game.name,
    startedAt: game.startedAt,
    finishedAt: game.finishedAt,
  };
}

/**
 *
 * @param {number} gameId
 * @param {number} [notId]
 * @param {import('drizzle-orm/sqlite-core').SQLiteTransaction} [trx]
 * @returns {Promise<number>}
 */
export async function getGameNextAction(gameId, notId = undefined, trx = undefined) {
  const where = and(eq(GameActions.gameId, gameId));
  if (notId) where.append(not(eq(GameActions.id), notId));

  const [result] = await (trx ?? db)
    .select({ id: GameActions.id, count: count(Players.id) })
    .from(GameActions)
    .leftJoin(Players, eq(Players.actionId, GameActions.id))
    .where()
    .groupBy(GameActions.id)
    .orderBy(sql`count asc`)
    .limit(1);

  return result?.id;
}
