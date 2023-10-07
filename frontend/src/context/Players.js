import { createPlayer as apiCreatePlayer, fetchPlayers } from "@/lib/client";
import { createContext, useEffect, useState } from "react";

export const PlayersContext = createContext({
  players: [],
  loading: false,
  error: undefined,
  /** @type {(player: import('@killer-game/types').PlayerRecord) => void} */
  createPlayer: (player) => {},
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
   * @param {Pick<import('@killer-game/types').PlayerRecord, 'name'>} player
   */
  function createPlayer(player) {
    apiCreatePlayer(gameId, player).then(addPlayer);
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

  return (
    <PlayersContext.Provider
      value={{
        players,
        error,
        loading,
        addPlayer,
        createPlayer,
      }}
    >
      {children}
    </PlayersContext.Provider>
  );
}