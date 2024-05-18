import { and, eq } from "drizzle-orm";
import db from "../database.mjs";
import { Players } from "../schema.mjs";

/**
 * @param {import("drizzle-orm").InferSelectModel<typeof Players>} player
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
export function update(player) {
  const [playerUpdated] = db
    .update(Players)
    .set({
      name: req.body?.["name"],
      avatar: req.body?.["avatar"],
      action_id: req.body?.["action_id"] ?? player.action_id,
      order: req.body?.["order"] ?? player.order,
    })
    .returning();

  return playerUpdated;
}
