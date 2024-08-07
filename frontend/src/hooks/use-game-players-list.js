import { mergePlayerRecord } from "@/utils/player";
import { useState } from "react";

/**
 * @template {import("@killer-game/types").PlayerRecord | import("@killer-game/types").PlayerRecordSanitized} Player
 * @param {Player[]} [initialPlayers]
 */
export function useGamePlayersList(initialPlayers = []) {
  const [players, setPlayers] = useState(initialPlayers);

  /**
   * @param {Player} player
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
   * @param {Player} player
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
        resolve(true);
        return [...old, player];
      })
    );
  }

  /**
   *
   * @param {Player} player
   */
  function deletePlayer(player) {
    setPlayers((p) => p.filter((o) => o.id !== player.id));
  }

  return { players, setPlayers, addPlayer, deletePlayer, updatePlayer };
}
