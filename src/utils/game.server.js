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
