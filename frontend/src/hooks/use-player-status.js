import { client } from "@/lib/client";
import { useEffect, useState } from "react";

/**
 * @typedef Return
 * @property {boolean} loading
 * @property {any} error
 * @property {import("@killer-game/types").PlayerStatus | undefined} playerStatus
 */

/**
 * @param {string | undefined} playerId
 * @param {string} playerPrivateToken
 * @returns {Return}
 */
export function usePlayerStatus(playerId, playerPrivateToken) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [playerStatus, setPlayerStatus] = useState();

  useEffect(() => {
    if (!playerId) return;
    setLoading(true);
    setError(undefined);
    client
      .fetchPlayerStatus(playerId, playerPrivateToken)
      .then(setPlayerStatus)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [playerId, playerPrivateToken]);

  return { loading, error, playerStatus };
}
