import { client } from "@/lib/client";
import { useEffect, useState } from "react";

/**
 * @typedef Return
 * @property {boolean} loading
 * @property {any} error
 * @property {import("@killer-game/types").GameRecord | undefined} game
 * @property {(game: import("@killer-game/types").GameRecord | undefined) => void} setGame
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
    client
      .fetchGame(gameId, gamePrivateToken)
      .then(setGame)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [gameId, gamePrivateToken]);

  return { loading, error, game, setGame };
}
