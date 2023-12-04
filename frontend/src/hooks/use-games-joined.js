import { useLocalStorageArray } from "./use-local-storage-array";

export function useGamesJoined() {
  const { addItem, getItems, items, removeItem } = useLocalStorageArray("gamesJoinedV1");

  return { games: items, addGame: addItem, removeGame: removeItem, getStoredGames: getItems };
}
