import { generateSmallUuid, generateUuid } from "../utils/uuid";
import { db } from "./db";

/**
 *
 * @param {string} field
 * @param {string | number} value
 * @returns {Promise<import("../models").Game>}
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
 *
 * @param {Pick<import("../models").Game, 'name'>} game
 * @returns {Promise<import("../models").Game>}
 */
export async function createGame(game) {
  /** @type {import("../models").Game} */
  const newGame = { private_token: generateUuid(), public_token: generateSmallUuid(), ...game };

  await db.table("games").insert(newGame);

  return newGame;
}

/**
 *
 * @param {import("../models").Game} game
 * @param {import('astro').AstroCookies} cookies
 */
export async function addGameUuidToCookies(game, cookies) {
  const tokens = new Set((cookies.get("game_private_tokens")?.value ?? "").split(","));
  tokens.add(game.private_token);
  cookies.set("game_private_tokens", [...tokens].join(","), { path: "/" });
}

/**
 * @param {import("../models").Game} game
 */
export function getGameAdminUrl(game) {
  return `/admin/games/${game.private_token}`;
}

/**
 * @param {import("../models").Game} game
 */
export function getGamePublicUrl(game) {
  return `/games/${game.public_token}`;
}
