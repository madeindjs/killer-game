import * as client from "@/lib/client";
import { createContext, useEffect, useState } from "react";

export const PlayersContext = createContext({
  players: [],
  loading: false,
  error: undefined,
  /** @type {(player: import('@killer-game/types').PlayerRecord) => void} */
  apiCreatedPlayer: (player) => {},
  /** @type {(player: import('@killer-game/types').PlayerRecord) => void} */
  apiUpdatePlayer: (player) => {},
  /** @type {(player: import('@killer-game/types').PlayerRecord) => void} */
  apiDeletePlayer: (player) => {},
  /** @type {(players: import('@killer-game/types').PlayerRecord[]) => void} */
  createPlayer: (player) => {},
  /** @type {(player: import('@killer-game/types').PlayerRecord[]) => void} */
  updatePlayer: (player) => {},
  /** @type {(player: import('@killer-game/types').PlayerRecord[]) => void} */
  deletePlayer: (player) => {},
});

/**
 * @param {{children: any, gameId: string, gamePrivateToken?: string}} param0
 */
export function PlayersProvider({ children, gameId, gamePrivateToken }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  /** @type {import('@killer-game/types').PlayerRecord[]} */
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    setLoading(true);
    client
      .fetchPlayers(gameId, gamePrivateToken)
      .then((g) => setPlayers(g))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [gameId, gamePrivateToken]);

  /**
   * @param {import('@killer-game/types').PlayerCreateDTO} player
   */
  function apiCreatedPlayer(player) {
    client.createPlayer(gameId, player).then(createPlayer);
  }

  /**
   * @param {import('@killer-game/types').PlayerUpdateDTO} player
   */
  function apiUpdatePlayer(player) {
    client.updatePlayer(gameId, player, gamePrivateToken).then(updatePlayer);
  }

  /**
   * @param {import('@killer-game/types').PlayerRecord} player
   */
  function apiDeletePlayer(player) {
    client.deletePlayer(gameId, player.id, gamePrivateToken).then(() => deletePlayer(player));
  }

  /**
   * @param {import('@killer-game/types').PlayerRecord} player
   */
  function createPlayer(player) {
    setPlayers((old) => {
      if (old.some((o) => o.id === player.id)) return old;
      return [...old, player];
    });
  }

  /**
   * @param {import('@killer-game/types').PlayerRecord} player
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
   * @param {import('@killer-game/types').PlayerRecord} player
   */
  function deletePlayer(player) {
    setPlayers((old) => old.filter((o) => o.id !== player.id));
  }

  return (
    <PlayersContext.Provider
      value={{
        players,
        error,
        loading,
        apiCreatedPlayer,
        apiUpdatePlayer,
        apiDeletePlayer,
        createPlayer,
        updatePlayer,
        deletePlayer,
      }}
    >
      {children}
    </PlayersContext.Provider>
  );
}
