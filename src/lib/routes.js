/**
 * @import {GameRecord, PlayerRecord} from '@/models'
 */

/**
 * @param {GameRecord} game
 */
export function getGameUrl(game, lang = "") {
  const params = new URLSearchParams({ password: game.password });
  return `${getLangPrefix(lang)}/games/${game.slug}?${params}`;
}

/**
 * @param {GameRecord} game
 */
export function getGameJoinUrl(game, lang = "") {
  return `${getLangPrefix(lang)}/games/${game.id}/join`;
}

/**
 * @param {PlayerRecord} player
 */
export function getPlayerUrl(player, lang = "") {
  const params = new URLSearchParams({ password: player.privateToken });
  return `${getLangPrefix(lang)}/players/${player.id}?${params}`;
}

function getLangPrefix(lang) {
  return lang ? `/${lang}` : "";
}
