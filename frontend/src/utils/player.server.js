/**
 * @typedef {typeof import('@/lib/drizzle/schema.mjs').Players} Players
 * @param {import("drizzle-orm").InferSelectModel<Players>} player
 * @returns {import("drizzle-orm").InferSelectModel<Players>}
 */
export function anonymizePlayer(player) {
  return {
    id: "hidden",
    name: "hidden",
    actionId: "hidden",
    killToken: -1,
    killedAt: player.killedAt,
    killedBy: "hidden",
    order: -1,
    privateToken: "hidden",
    gameId: player.gameId,
    avatar: undefined,
  };
}

/**
 * @param {import("drizzle-orm").InferSelectModel<Players>} player
 */
export function sanitizePlayer(player) {
  return {
    id: player.id,
    name: player.name,
    gameId: player.game_id,
    avatar: player.avatar,
  };
}
