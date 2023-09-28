import { COOKIES_KEYS } from "../constants";
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
 * @param {import('astro').AstroCookies} cookies
 */
function getGamePrivateTokens(cookies) {
  const key = COOKIES_KEYS.gamePrivateTokens;
  const tokens = new Set((cookies.get(key)?.value ?? "").split(","));
  return [...tokens];
}

/**
 * @param {Game} game
 * @param {import('astro').AstroCookies} cookies
 */
export async function addGamePrivateTokenToCookies(game, cookies) {
  cookies.set(COOKIES_KEYS.gamePrivateTokens, [...getGamePrivateTokens(cookies), game.private_token].join(","), {
    path: "/",
  });
}

/**
 * @param {Game} game
 * @param {import('astro').AstroCookies} cookies
 */
export async function addGamePublicTokenToCookies(game, cookies) {
  cookies.set(COOKIES_KEYS.gamePrivateTokens, [...getGamePrivateTokens(cookies), game.private_token].join(","), {
    path: "/",
  });
}

/**
 * @param {import('astro').AstroCookies} cookies
 * @returns {Promise<Game[]>}
 */
export async function getCreatedGameFromCookies(cookies) {
  const tokens = getGamePrivateTokens(cookies);
  return db.table("games").whereIn("private_token", tokens);
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
