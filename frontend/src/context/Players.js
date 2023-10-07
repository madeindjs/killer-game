import { createPlayer as apiCreatePlayer, updatePlayer as apiUpdatePlayer, fetchPlayers } from "@/lib/client";
import { createContext, useEffect, useState } from "react";

export const PlayersContext = createContext({
  players: [],
  loading: false,
  error: undefined,
  /** @type {(player: import('@killer-game/types').PlayerRecord) => void} */
  createPlayer: (player) => {},
  /** @type {(player: import('@killer-game/types').PlayerRecord) => void} */
  updatePlayer: (player) => {},
  /** @type {(players: import('@killer-game/types').PlayerRecord[]) => void} */
  addPlayer: (player) => {},
});

/**
 * @param {{children: any, gameId: string, gamePrivateToken?: string}} param0
 */
export function PlayersProvider({ children, gameId, gamePrivateToken }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  /** @type {import('@killer-game/types').PlayerRecord[]} */
  const initialPlayers = [];
  const [players, setPlayers] = useState(initialPlayers);

  useEffect(() => {
    setLoading(true);
    fetchPlayers(gameId, gamePrivateToken)
      .then((g) => setPlayers(g))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [gameId, gamePrivateToken]);

  /**
   * @param {import('@killer-game/types').PlayerCreateDTO} player
   */
  function createPlayer(player) {
    apiCreatePlayer(gameId, player).then(addPlayer);
  }

  /**
   * @param {import('@killer-game/types').PlayerUpdateDTO} player
   */
  function updatePlayer(player) {
    apiUpdatePlayer(gameId, player, gamePrivateToken).then(refreshPlayer);
  }

  /**
   * @param {import('@killer-game/types').PlayerRecord} player
   */
  function addPlayer(player) {
    setPlayers((old) => {
      if (old.some((o) => o.id === player.id)) return old;
      return [...old, player];
    });
  }

  /**
   * @param {import('@killer-game/types').PlayerRecord} player
   */
  function refreshPlayer(player) {
    setPlayers((old) => {
      const copy = [...old];
      const index = old.findIndex((o) => o.id === player.id);
      copy[index] = player;

      return copy;
    });
  }

  return (
    <PlayersContext.Provider
      value={{
        players,
        error,
        loading,
        addPlayer,
        createPlayer,
        updatePlayer,
      }}
    >
      {children}
    </PlayersContext.Provider>
  );
}
