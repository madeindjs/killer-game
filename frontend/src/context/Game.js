import { fetchGame } from "@/lib/client";
import { createContext, useEffect, useState } from "react";

export const GameContext = createContext({
  game: undefined,
  loading: false,
  error: undefined,
});

/**
 * @param {{children: any, gameId: string, gamePrivateToken?: string}} param0
 */
export function GameProvider({ children, gameId, gamePrivateToken }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [game, setGame] = useState(undefined);

  useEffect(() => {
    setLoading(true);
    fetchGame(gameId, gamePrivateToken)
      .then((g) => setGame(g))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [gameId, gamePrivateToken]);

  return (
    <GameContext.Provider
      value={{
        game,
        error,
        loading,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
