import { useLocalStorageArray } from "./use-local-storage-array";

export function useGamesCreated() {
  const { addItem, getItems, items, removeItem } = useLocalStorageArray("gamesCreatedV1");

  return { games: items, addGame: addItem, removeGame: removeItem, getStoredGames: getItems };
}
