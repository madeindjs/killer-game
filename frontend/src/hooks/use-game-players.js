import { client } from "@/lib/client";
import { mergePlayerRecord } from "@/utils/player";
import { useCallback, useState } from "react";

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

  const load = useCallback(() => {
    if (!gameId) return;
    setLoading(true);
    setError(undefined);
    client
      .fetchPlayers(gameId, gamePrivateToken)
      .then(setPlayers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [gameId, gamePrivateToken]);

  /**
   * @param {import("@killer-game/types").PlayerRecord |} player
   */
  function updatePlayer(player) {
    setPlayers((old) => {
      const copy = [...old];
      const index = old.findIndex((o) => o.id === player.id);

      const oldPlayer = copy[index];

      copy[index] = mergePlayerRecord(oldPlayer, player);

      return copy;
    });
  }

  /**
   *
   * @param {import("@killer-game/types").PlayerRecord} player
   */
  function addPlayer(player) {
    return new Promise((resolve) =>
      setPlayers((old) => {
        const existingPlayerIndex = old.findIndex((p) => p.id === player.id);
        if (existingPlayerIndex !== -1) {
          console.log("player already exists, skipping");
          for (var key in player) {
            if (old[existingPlayerIndex][key]) continue;
            old[existingPlayerIndex][key] = player[key];
          }
          resolve(false);
          return old;
        }
        console.log("add player");
        resolve(true);
        return [...old, player];
      })
    );
  }

  /**
   *
   * @param {import("@killer-game/types").PlayerRecord} player
   */
  function deletePlayer(player) {
    setPlayers((p) => p.filter((o) => o.id !== player.id));
  }

  return { loading, error, players, setPlayers, addPlayer, deletePlayer, addPlayer, updatePlayer, load };
}
