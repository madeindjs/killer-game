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
 * @param {string} [privateToken] the `privateToken` of the game or of the player
 * @returns {Return}
 */
export function useGameDashboard(gameId, privateToken) {
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [dashboard, setDashboard] = useState();

  const load = useCallback(() => {
    if (!gameId) return;
    setLoading(true);
    setError(undefined);
    client
      .fetchGameDashboard(gameId, privateToken)
      .then(setDashboard)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [gameId, privateToken]);

  return { loading, error, dashboard, load };
}
