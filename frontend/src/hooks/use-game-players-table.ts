import { client } from "@/lib/client";
import { GamePlayersTable } from "@killer-game/types";
import { useCallback, useState } from "react";

export function useGamePlayersTable(gameId: string, gamePrivateToken: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [table, setTable] = useState<GamePlayersTable>([]);

  const load = useCallback(
    ({ displayAllPlayers }: { displayAllPlayers?: boolean } = {}) => {
      if (!gameId) return;
      setLoading(true);
      setError(undefined);
      client
        .fetchPlayersTable(gameId, gamePrivateToken, { displayAllPlayers })
        .then(setTable)
        .catch(setError)
        .finally(() => setLoading(false));
    },
    [gameId, gamePrivateToken],
  );

  return { loading, error, table, load };
}
