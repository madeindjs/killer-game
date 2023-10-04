import { createPlayer, fetchPlayers } from "@/lib/client";
import { createContext, useEffect, useState } from "react";

export const PlayersContext = createContext({
  players: [],
  loading: false,
  error: undefined,
  /** @type {(player: PlayerRecord) => void} */
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

  console.log("ok");

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

  function updatePlayers(players) {
    setPlayers(players);
  }

  useEffect(() => console.log("##", players), [players, gameId, gamePrivateToken]);

  const SubscriberEventNames = {
    GameCreated: "GameCreated",
    GameUpdated: "GameUpdated",
    GameDeleted: "GameDeleted",
    PlayerCreated: "PlayerCreated",
    PlayerUpdated: "PlayerUpdated",
    PlayerDeleted: "PlayerDeleted",
  };

  function onSseEvent(event) {
    switch (event.event) {
      case SubscriberEventNames.PlayerCreated:
        if (players.find((p) => p.id === event.payload.id)) return;
        console.log(players);
        debugger;
        setPlayers([...players, event.payload]);
        break;
    }
  }

  useEffect(() => {
    const evtSource = new EventSource(`http://localhost:3001/games/${gameId}/sse`);

    evtSource.onmessage = (event) => {
      try {
        onSseEvent(JSON.parse(event.data));
      } catch (error) {
        console.error(error);
      }
    };

    return () => evtSource.close();
  }, [gameId]);

  return (
    <PlayersContext.Provider
      value={{
        players,
        error,
        loading,
        addPlayer,
        updatePlayers,
      }}
    >
      {children}
    </PlayersContext.Provider>
  );
}
