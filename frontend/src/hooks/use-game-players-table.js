import { client } from "@/lib/client";
import { useEffect, useState } from "react";

/**
 * @typedef Return
 * @property {boolean} loading
 * @property {any} error
 * @property {import("@killer-game/types").GamePlayersTable | undefined} table
 */

/**
 * @param {string | undefined} gameId
 * @param {string} gamePrivateToken
 * @returns {Return}
 */
export function useGamePlayersTable(gameId, gamePrivateToken) {
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [table, setTable] = useState();

  useEffect(() => {
    if (!gameId) return;
    setLoading(true);
    setError(undefined);
    client
      .fetchPlayersTable(gameId, gamePrivateToken)
      .then(setTable)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [gameId, gamePrivateToken]);

  return { loading, error, table };
}
