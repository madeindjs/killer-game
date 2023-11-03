import { client } from "@/lib/client";
import { useCallback, useState } from "react";

/**
 * @typedef Return
 * @property {boolean} loading
 * @property {any} error
 * @property {import("@killer-game/types").GameDashboard | undefined} dashboard
 * @property {() => Promise<void>} load
 */

/**
 * @param {string | undefined} gameId
 * @param {string} gamePrivateToken
 * @returns {Return}
 */
export function useGameDashboard(gameId, gamePrivateToken) {
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [dashboard, setDashboard] = useState();

  const load = useCallback(() => {
    if (!gameId) return;
    setLoading(true);
    setError(undefined);
    client
      .fetchGameDashboard(gameId, gamePrivateToken)
      .then(setDashboard)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [gameId, gamePrivateToken]);

  return { loading, error, dashboard, load };
}
