import { db } from ".";
import { COOKIES_KEYS } from "../constants";

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
