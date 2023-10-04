export function getGameUrl(game) {
  const params = new URLSearchParams({ token: game.private_token });
  return `/games/${game.id}?${params}`;
}
