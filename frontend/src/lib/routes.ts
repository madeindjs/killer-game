import type { GameRecord, PlayerRecord } from "@killer-game/types";

type GameRef = Pick<GameRecord, "id" | "slug"> & Partial<Pick<GameRecord, "private_token">>;
type PlayerRef = Pick<PlayerRecord, "id"> &
  Partial<Pick<PlayerRecord, "private_token" | "kill_token">>;

export function getGameUrl(game: GameRef, lang: string = ""): string {
  return withPassword(buildURL(lang, "games", game.slug ?? game.id), game.private_token);
}

export function getGameJoinUrl(
  game: GameRef,
  lang: string = "",
  origin: string | undefined = undefined,
): string {
  return buildURL(origin, lang, "games", game.slug ?? game.id, "join");
}

/**
 * Single, shareable invitation link for a game (e.g. `https://the-killer.online/join/my-party`).
 *
 * It intentionally contains no locale: each participant is redirected to the
 * join page in their own language by the i18n middleware.
 */
export function getGameInviteUrl(
  game: GameRef,
  origin: string | undefined = undefined,
): string {
  return buildURL(origin, "join", game.slug ?? game.id);
}

export function getPlayerUrl(
  game: GameRef,
  player: PlayerRef,
  lang: string = "",
  domain: string | undefined = undefined,
): string {
  return withPassword(
    buildURL(domain, lang, "games", game.slug ?? game.id, "players", player.id),
    player.private_token,
  );
}

export function getPlayerKillUrl(
  game: GameRef,
  player: PlayerRef,
  lang: string = "",
  domain: string | undefined = undefined,
): string {
  return withPassword(
    buildURL(domain, lang, "games", game.slug ?? game.id, "players", player.id, "kill"),
    player.kill_token,
  );
}

function buildURL(...parts: Array<string | number | undefined | null>): string {
  const url = parts.filter(Boolean).join("/");
  if (url.startsWith("http") || url.startsWith("/")) return url;
  return `/${url}`;
}

function withPassword(url: string, password: string | number | undefined | null): string {
  if (!password) return url;
  const params = new URLSearchParams({ password: String(password) });
  return `${url}?${params}`;
}
