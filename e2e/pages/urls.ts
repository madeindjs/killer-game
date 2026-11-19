/** Frontend URLs (relative to the base URL), mirroring `frontend/src/lib/routes.ts`. */

interface GameRef {
  id: string;
  slug?: string | null;
  private_token?: string;
}

interface PlayerRef {
  id: string;
  private_token?: string;
  kill_token?: number | string;
}

const withPassword = (url: string, password?: string | number): string =>
  password ? `${url}?${new URLSearchParams({ password: String(password) })}` : url;

export const urls = {
  home: (lang = "en") => `/${lang}`,
  games: (lang = "en") => `/${lang}/games`,
  gameAdmin: (game: GameRef, lang = "en") => withPassword(`/${lang}/games/${game.id}`, game.private_token),
  gameJoin: (game: GameRef, lang = "en") => `/${lang}/games/${game.id}/join`,
  invite: (game: GameRef) => `/join/${game.slug ?? game.id}`,
  player: (game: GameRef, player: PlayerRef, lang = "en") =>
    withPassword(`/${lang}/games/${game.id}/players/${player.id}`, player.private_token),
  playerKill: (game: GameRef, player: PlayerRef, lang = "en") =>
    withPassword(`/${lang}/games/${game.id}/players/${player.id}/kill`, player.kill_token),
};
