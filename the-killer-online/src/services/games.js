import { db } from "./db";

/**
 * @param {string} uuid
 * @returns {Promise<import("../models").Game>}
 */
export function fetchGame(uuid) {
  return db.table("games").where({ uuid }).first();
}

/**
 *
 * @param {Pick<import("../models").Game, 'name'>} game
 * @returns {Promise<import("../models").Game>}
 */
export async function createGame(game) {
  const newGame = { ...game, uuid: crypto.randomUUID() };

  await db.table("games").insert(newGame);

  return newGame;
}

/**
 *
 * @param {string} uuid
 * @param {import('astro').AstroCookies} cookies
 */
export async function addGameUuidToCookies(uuid, cookies) {
  const gamesIds = new Set((cookies.get("games")?.value ?? "").split(","));
  gamesIds.add(uuid);
  cookies.set("games", [...gamesIds].join(","), { path: "/" });
}
