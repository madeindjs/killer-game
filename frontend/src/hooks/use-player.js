import { fetchPlayer } from "@/lib/client";
import { useEffect, useState } from "react";

/**
 * @param {string} playerId
 * @param {string} [playerPrivateToken]
 * @returns
 */
export function usePlayer(playerId, playerPrivateToken) {
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [player, setPlayer] = useState();

  useEffect(() => {
    if (!playerId) return;
    setLoading(true);
    setError(undefined);
    fetchPlayer(playerId, playerPrivateToken)
      .then(setPlayer)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [playerId, playerPrivateToken]);

  return { loading, error, player };
}
