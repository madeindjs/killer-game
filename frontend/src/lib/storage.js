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
  }

  function addGame(game) {
    load();
    games.push(game);
    localStorage.setItem(key, JSON.stringify(games));
  }

  load();

  return { games, addGame };
}
