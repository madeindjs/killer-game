import { client2 } from "@/lib/client";
import { useEffect, useState } from "react";

/**
 *
 * @typedef {typeof import('@/lib/drizzle/schema.mjs').Games} Games
 * @typedef {import("drizzle-orm").InferSelectModel<Games>} GameRecord
 *
 * @typedef Return
 * @property {boolean} loading
 * @property {any} error
 * @property {GameRecord | undefined} game
 * @property {(game: GameRecord | undefined) => void} setGame
 */

/**
 * @param {string | undefined} gameId
 * @param {string} [gamePrivateToken]
 * @returns {Return}
 */
export function useGame(gameId, gamePrivateToken) {
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [game, setGame] = useState();

  useEffect(() => {
    if (!gameId) return;
    setLoading(true);
    setError(undefined);
    client2
      .fetchGame(gameId, gamePrivateToken)
      .then(setGame)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [gameId, gamePrivateToken]);

  return { loading, error, game, setGame };
}
