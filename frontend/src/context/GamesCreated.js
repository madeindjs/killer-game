import { fetchGame } from "@/lib/client";
import { createContext, useEffect, useState } from "react";

export const GamesCreatedContext = createContext({
  games: [],
  add: (game) => {},
});

export function GameCreatedProvider({ children }) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const createdGameIds = localStorage.getItem("game_created")?.split(",") ?? [];
    const fetchGamesPromises = createdGameIds.map((gameId) => fetchGame(gameId).catch(() => undefined));
    Promise.all(fetchGamesPromises).then((games) => setGames(games));
  });

  return (
    <GamesCreatedContext.Provider
      value={{
        games,
        add: (game) => setGames([...games, game]),
      }}
    >
      {children}
    </GamesCreatedContext.Provider>
  );
}
