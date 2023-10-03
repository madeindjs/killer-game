import { generateSmallUuid, generateUuid } from "../utils/uuid";

/**
 *
 * @param {gameId} field
 * @returns {Promise<Game>}
 */
export async function fetchGame(gameId) {
  const res = await fetch(`${import.meta.env.PUBLIC_API_URL}/games/${gameId}`);
  if (!res.ok) throw Error();

  const json = res.json();

  return json.data;
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
