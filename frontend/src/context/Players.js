import { createPlayer as apiCreatePlayer, fetchPlayers } from "@/lib/client";
import { createContext, useEffect, useState } from "react";

export const PlayersContext = createContext({
  players: [],
  loading: false,
  error: undefined,
  /** @type {(player: PlayerRecord) => void} */
  createPlayer: (player) => {},
  /** @type {(players: PlayerRecord[]) => void} */
  addPlayer: (player) => {},
  /** @type {(players: PlayerRecord[]) => void} */
  updatePlayers: (players) => {},
});

/**
 * @param {{children: any, gameId: string, gamePrivateToken?: string}} param0
 */
export function PlayersProvider({ children, gameId, gamePrivateToken }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetchPlayers(gameId, gamePrivateToken)
      .then((g) => setPlayers(g))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [gameId, gamePrivateToken]);

  function createPlayer(player) {
    apiCreatePlayer(gameId, player).then(addPlayer);
  }

  function addPlayer(player) {
    setPlayers([...players, player]);
  }

  function updatePlayers(players) {
    setPlayers(players);
  }

  return (
    <PlayersContext.Provider
      value={{
        players,
        error,
        loading,
        addPlayer,
        createPlayer,
        updatePlayers,
      }}
    >
      {children}
    </PlayersContext.Provider>
  );
}
