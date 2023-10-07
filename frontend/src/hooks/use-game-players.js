import { fetchPlayers } from "@/lib/client";
import { useEffect, useState } from "react";

/**
 * @typedef Return
 * @property {boolean} loading
 * @property {any} error
 * @property {import("@killer-game/types").PlayerRecord[]} players[]
 * @property {(game: import("@killer-game/types").PlayerRecord[]) => void} setPlayers
 */

/**
 * @param {string | undefined} gameId
 * @param {string} [gamePrivateToken]
 * @returns
 */
export function useGamePlayers(gameId, gamePrivateToken) {
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!gameId) return;
    setLoading(true);
    setError(undefined);
    fetchPlayers(gameId, gamePrivateToken)
      .then(setPlayers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [gameId, gamePrivateToken]);

  return { loading, error, players, setPlayers };
}
