import "../model";
import { generateSmallUuid } from "../utils/uuid";
import { fetchGameByPublicToken } from "./games";

/**
 *
 * @param {string} field
 * @param {string | number} value
 * @returns {Promise<Player>}
 */
export function fetchPlayerBy(field, value) {
  return db
    .table("players")
    .where({ [field]: value })
    .first();
}

/**
 * @param {string} publicToken
 */
export const fetchPlayerByPublicToken = (publicToken) => fetchPlayerBy("public_token", publicToken);

/**
 *
 * @param {number} gameId
 * @returns {Promise<Player[]>}
 */
export function fetchGamePayers(gameId) {
  return db.table("players").where({ game_id: gameId });
}

/**
 * @param {Pick<Player, 'name'>} player
 */
export async function createPlayer(player, gamePublicToken) {
  const game = await fetchGameByPublicToken(gamePublicToken);

  /** @type {import("../models").Player} */
  const newGame = { public_token: generateSmallUuid(), game_id: game.id, ...player };

  const res = await db.table("players").insert(newGame).returning("id");
  console.log(res);

  return newGame;
}

/**
 * @param {Player} game
 */
export function getPlayerAdminUrl(game) {
  // TODO
  return `/admin/games/${game.private_token}`;
}

/**
 * @param {Player} game
 */
export function getPlayerPublicUrl(game) {
  return `/players/${game.public_token}`;
}
