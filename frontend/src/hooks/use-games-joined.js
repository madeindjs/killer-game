import { useLocalStorageArray } from "./use-local-storage-array";

export function useGamesJoined() {
  const { addItem, getItems, items, removeItem } = useLocalStorageArray("gamesJoinedV1");

  /**
   *
   * @param {import("@killer-game/types").GameRecord} game
   */
  function addGame(game) {
    const exists = items.some((g) => g.id === game.id);
    if (exists) return;
    return addItem(game);
  }

  return { games: items, addGame, removeGame: removeItem, getStoredGames: getItems };
}
