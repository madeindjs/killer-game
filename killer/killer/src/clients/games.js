import { createEntity, destroyEntity, fetchEntities, fetchEntity } from "./base";

/**
 * @param {Game} game
 * @returns {Promise<Game[]>}
 */
export async function createGame(game) {
  return createEntity("games", game);
}

/**
 * @returns {Promise<Game[]>}
 */
export function fetchGames() {
  return fetchEntities("games");
}

/**
 * @param {number} gameId
 * @returns {Promise<Game>}
 */
export function fetchGame(gameId) {
  return fetchEntity("games", gameId);
}

/**
 * @param {number} gameId
 */
export function destroyGame(gameId) {
  return destroyEntity("games", gameId);
}
