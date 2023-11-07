import { useEffect, useState } from "react";

export function useGamesCreated() {
  const key = "gamesCreatedV1";

  const [games, _setGames] = useState([]);

  useEffect(() => {
    _setGames(getStoredGames());
  }, []);

  function setGames(newGames) {
    localStorage.setItem(key, JSON.stringify(games));
    _setGames(newGames);
  }

  /**
   * @returns {import("@killer-game/types").GameRecord[]}
   */
  function getStoredGames() {
    const gamesStr = localStorage.getItem(key);

    try {
      if (!gamesStr) return [];
      return JSON.parse(gamesStr);
    } catch (error) {
      console.error(error);
      localStorage.removeItem(key);
      return [];
    }
  }

  /**
   *
   * @param {import("@killer-game/types").GameRecord} game
   */
  function removeGame(game) {
    setGames(games.filter((g) => g.id !== game.id));
  }

  function addGame(game) {
    setGames([...games, game]);
  }

  return { games, addGame, removeGame, getStoredGames };
}
