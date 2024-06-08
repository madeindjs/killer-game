/**
 * @param {import("@killer-game/types").GameRecord} game
 */
export function getGameUrl(game, lang = "") {
  const params = new URLSearchParams({ password: game.private_token });
  return `${getLangPrefix(lang)}/games/${game.slug ?? game.id}?${params}`;
}

/**
 * @param {import("@killer-game/types").GameRecord} game
 */
export function getGameJoinUrl(game, lang = "") {
  return `${getLangPrefix(lang)}/games/${game.slug ?? game.id}/join`;
}

/**
 * @param {import("@killer-game/types").PlayerRecord} player
 */
export function getPlayerUrl(player, lang = "") {
  const params = new URLSearchParams({ password: player.private_token });
  return `${getLangPrefix(lang)}/players/${player.id}?${params}`;
}

function getLangPrefix(lang) {
  return lang ? `/${lang}` : "";
}
