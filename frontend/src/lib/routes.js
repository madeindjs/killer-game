/**
 * @param {import("@killer-game/types").GameRecord} game
 */
export function getGameUrl(game, lang = "") {
  return withPassword(buildURL(lang, "games", game.slug ?? game.id), game.private_token);
}

/**
 * @param {import("@killer-game/types").GameRecord} game
 */
export function getGameJoinUrl(game, lang = "") {
  return buildURL(lang, "games", game.slug ?? game.id, "join");
}

/**
 * @param {import("@killer-game/types").GameRecord} game
 * @param {import("@killer-game/types").PlayerRecord} player
 */
export function getPlayerUrl(game, player, lang = "") {
  return withPassword(buildURL(lang, "games", game.slug ?? game.id, "players", player.id), player.private_token);
}

/**
 * @param {import("@killer-game/types").GameRecord} game
 * @param {import("@killer-game/types").PlayerRecord} player
 */
export function getPlayerKillUrl(game, player, lang = "", domain = undefined) {
  return withPassword(
    buildURL(domain, lang, "games", game.slug ?? game.id, "players", player.id, "kill"),
    player.kill_token
  );
}

/**
 *
 * @param {Array<string | number>} parts
 */
function buildURL(...parts) {
  const url = parts.filter(Boolean).join("/");
  if (url.startsWith("http") || url.startsWith("/")) return url;
  return `/${url}`;
}

/**
 *
 * @param {string} url
 * @param {string | undefined} params
 */
function withPassword(url, password) {
  if (!password) return url;
  const params = new URLSearchParams({ password });
  return `${url}?${params}`;
}
