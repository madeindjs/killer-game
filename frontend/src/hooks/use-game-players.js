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

  /**
   *
   * @param {import("@killer-game/types").PlayerRecord} player
   */
  function updatePlayer(player) {
    setPlayers((old) => {
      const copy = [...old];
      const index = old.findIndex((o) => o.id === player.id);
      copy[index] = player;

      return copy;
    });
  }

  /**
   *
   * @param {import("@killer-game/types").PlayerRecord} player
   */
  function addPlayer(player) {
    setPlayers((old) => {
      if (old.some((p) => p.id === player.id)) return old;
      return [...old, player];
    });
  }

  /**
   *
   * @param {import("@killer-game/types").PlayerRecord} player
   */
  function deletePlayer(player) {
    setPlayers((p) => p.filter((o) => o.id !== player.id));
  }

  return { loading, error, players, setPlayers, addPlayer, deletePlayer, addPlayer, updatePlayer };
}
