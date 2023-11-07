import { useEffect, useState } from "react";

export function useGamesCreated() {
  const key = "gamesCreatedV1";

  const [games, _setGames] = useState([]);

  useEffect(() => {
    _setGames(getStoredGames());
  }, []);

  /**
   *
   * @param {import("@killer-game/types").GameRecord[]} newGames
   */
  function setGames(newGames) {
    localStorage.setItem(key, JSON.stringify(newGames));
    _setGames(newGames);
  }

  /**
   * @returns {import("@killer-game/types").GameRecord[]}
   */
  function getStoredGames() {
    const gamesStr = localStorage.getItem(key);
    if (!gamesStr) return [];

    try {
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

  /**
   *
   * @param {import("@killer-game/types").GameRecord} game
   */
  function addGame(game) {
    console.log("add games", game);
    setGames([...games, game]);
    debugger;
  }

  return { games, addGame, removeGame, getStoredGames };
}
