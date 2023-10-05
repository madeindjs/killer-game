export function useStorageCreatedGames() {
  const key = "gamesCreatedV1";

  let games = [];

  function load() {
    const gamesStr = localStorage.getItem(key);

    if (!gamesStr) return;

    try {
      games = JSON.parse(gamesStr);
    } catch (error) {
      console.error(error);
      localStorage.removeItem(key);
    }

    return games;
  }

  function removeGame(gameId) {
    load();
    games = games.filter((g) => g.id !== gameId);
    localStorage.setItem(key, JSON.stringify(games));
  }

  function addGame(game) {
    load();
    games.push(game);
    localStorage.setItem(key, JSON.stringify(games));
  }

  return { games, addGame, removeGame, load };
}
