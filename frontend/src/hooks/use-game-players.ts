import { client } from "@/lib/client";
import { mergePlayerRecord } from "@/utils/player";
import type { PlayerRecord } from "@killer-game/types";
import { useCallback, useState } from "react";

export function useGamePlayers(gameId: string, gamePrivateToken: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [players, setPlayers] = useState<PlayerRecord[]>([]);

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

  function updatePlayer(player: PlayerRecord) {
    setPlayers((old) => {
      const copy = [...old];
      const index = old.findIndex((o) => o.id === player.id);

      const oldPlayer = copy[index];

      copy[index] = mergePlayerRecord(oldPlayer, player);

      return copy;
    });
  }

  function addPlayer(player: PlayerRecord) {
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
        resolve(true);
        return [...old, player];
      }),
    );
  }

  function deletePlayer(player: PlayerRecord) {
    setPlayers((p) => p.filter((o) => o.id !== player.id));
  }

  return {
    loading,
    error,
    players,
    setPlayers,
    addPlayer,
    deletePlayer,
    updatePlayer,
    load,
  };
}
