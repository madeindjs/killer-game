import { createEntity, destroyEntity, fetchEntities, fetchEntity } from "./base";

/**
 * @param {Game} game
 * @returns {Promise<Game[]>}
 */
export async function createPlayer(game) {
  return createEntity("players", game);
}

/**
 * @returns {Promise<Game[]>}
 */
export function fetchGamePlayers(gameId) {
  return fetchEntities("players", { gameId });
}

/**
 * @returns {Promise<Game[]>}
 */
export function fetchPlayers() {
  return fetchEntities("players");
}

/**
 * @param {number} playerId
 * @returns {Promise<Game>}
 */
export function fetchPlayer(playerId) {
  return fetchEntity("players", playerId);
}

/**
 * @param {number} gameId
 */
export function destroyPlayer(gameId) {
  return destroyEntity("players", gameId);
}
