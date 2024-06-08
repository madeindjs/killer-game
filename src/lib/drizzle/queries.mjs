import { and, desc, eq } from "drizzle-orm";
import db from "./database.mjs";
import { Players } from "./schema.mjs";

/**
 *
 * @import { Games, GameActions, Players } from '@/lib/drizzle/schema.mjs'
 * @import { InferSelectModel } from 'drizzle-orm'
 */

/**
 * @param {InferSelectModel<typeof Players>} player
 */
export async function updatePlayer(player) {
  const [currentPlayer] = await db.select().from(Players);
  if (!currentPlayer) throw Error();

  if (currentPlayer.order === player.order) return update(player);

  const [playerOrderSwap] = await db
    .select()
    .from(Players)
    .where(and(eq(Players.gameId, player.gameId)), eq(Players.order, player.order));

  if (!playerOrderSwap) return update(player);

  await update({ ...playerOrderSwap, order: currentPlayer.order });
  return update(player);
}

/**
 * @param {import("drizzle-orm").InferSelectModel<typeof Players>} player
 */
export async function update(player) {
  const [playerUpdated] = await db
    .update(Players)
    .set(player)
    .where(and(eq(Players.id, player.id), eq(Players.gameId, player.gameId)))
    .returning();

  return playerUpdated;
}

export async function getNextPlayerOrder(gameId) {
  const [result] = await db
    .select({ order: Players.order })
    .from(Players)
    .where(eq(Players.gameId, gameId))
    .orderBy(desc(Players.order))
    .limit(1);

  return result?.order === undefined ? 0 : result.order + 1;
}
