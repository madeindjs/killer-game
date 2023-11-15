import { client } from "@/lib/client";
import { useCallback, useEffect, useState } from "react";

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

  const load = useCallback(() => {
    if (!playerId) return;

    setError(undefined);

    return client
      .fetchPlayerStatus(playerId, playerPrivateToken)
      .then(setPlayerStatus)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [playerId, playerPrivateToken]);

  useEffect(load, [playerId, playerPrivateToken, load]);

  return { loading, error, playerStatus, load };
}
