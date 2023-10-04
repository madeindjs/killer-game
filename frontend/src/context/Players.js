import { createPlayer, fetchPlayers } from "@/lib/client";
import { createContext, useEffect, useState } from "react";

export const PlayersContext = createContext({
  players: [],
  loading: false,
  error: undefined,
  addPlayer: (player) => {},
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

  function addPlayer(player) {
    createPlayer(gameId, player).then((player) => {
      setPlayers([...players, player]);
    });
  }

  return (
    <PlayersContext.Provider
      value={{
        players,
        error,
        loading,
        addPlayer,
      }}
    >
      {children}
    </PlayersContext.Provider>
  );
}
