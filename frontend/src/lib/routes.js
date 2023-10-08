/**
 * @param {import("@killer-game/types").GameRecord} game
 */
export function getGameUrl(game) {
  const params = new URLSearchParams({ token: game.private_token });
  return `/games/${game.id}?${params}`;
}

/**
 * @param {import("@killer-game/types").GameRecord} game
 */
export function getGameJoinUrl(game) {
  return `/games/${game.id}/join`;
}

/**
 * @param {import("@killer-game/types").PlayerRecord} player
 */
export function getPlayerUrl(player) {
  const params = new URLSearchParams({ token: player.private_token });
  return `/players/${player.id}?${params}`;
}
