import { generateSmallUuid, generateUuid } from "../utils/uuid";
import { db } from "./db";

/**
 *
 * @param {string} field
 * @param {string | number} value
 * @returns {Promise<Game>}
 */
export function fetchGameBy(field, value) {
  return db
    .table("games")
    .where({ [field]: value })
    .first();
}

/**
 * @param {number} id
 */
export const fetchGameById = (id) => fetchGameBy("id", id);

/**
 * @param {string} privateToken
 */
export const fetchGameByPrivateToken = (privateToken) => fetchGameBy("private_token", privateToken);

/**
 * @param {string} publicToken
 */
export const fetchGameByPublicToken = (publicToken) => fetchGameBy("public_token", publicToken);

/**
 * @param {Pick<Game, 'name'>} game
 * @returns {Promise<Game>}
 */
export async function createGame(game) {
  /** @type {Game} */
  const newGame = { private_token: generateUuid(), public_token: generateSmallUuid(), ...game };

  await db.table("games").insert(newGame);

  return newGame;
}

/**
 * @param {Game} game
 */
export function getGameAdminUrl(game) {
  return `/admin/games/${game.private_token}`;
}

/**
 * @param {Game} game
 */
export function getGamePublicUrl(game) {
  return `/games/${game.public_token}`;
}
