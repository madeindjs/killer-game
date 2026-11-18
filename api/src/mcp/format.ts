import type { GameRecord, PlayerRecord } from "@killer-game/types";

const DEFAULT_SITE_URL = "https://the-killer.online";
const DEFAULT_LOCALE = "en";

const TIMESTAMP_FIELDS = ["created_at", "updated_at", "started_at", "finished_at", "killed_at"] as const;

/** SQLite `CURRENT_TIMESTAMP` format: UTC, space separated, no timezone. */
const SQLITE_TIMESTAMP = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d+)?$/;

export function getSiteUrl(): string {
  const url = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  return url.replace(/\/+$/, "");
}

/**
 * Convert any stored timestamp to ISO 8601 UTC so every date field exposed over
 * MCP uses the same format. SQLite defaults (`created_at`) are stored as UTC
 * without a timezone marker, while values written by the app are ISO strings.
 */
export function toIsoTimestamp(value: unknown): unknown {
  if (value === null || value === undefined || value === "") return value;
  if (typeof value === "number") return new Date(value).toISOString();
  if (typeof value !== "string") return value;

  const normalized = SQLITE_TIMESTAMP.test(value) ? `${value.replace(" ", "T")}Z` : value;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}

function normalizeTimestamps<T extends object>(record: T): T {
  const copy: Record<string, unknown> = { ...record };
  for (const field of TIMESTAMP_FIELDS) {
    if (field in copy) copy[field] = toIsoTimestamp(copy[field]);
  }
  return copy as T;
}

export function getGameAdminUrl(game: Pick<GameRecord, "id" | "slug" | "private_token">): string {
  const params = new URLSearchParams({ password: game.private_token });
  return `${getSiteUrl()}/${DEFAULT_LOCALE}/games/${encodeURIComponent(game.slug ?? game.id)}?${params}`;
}

export function getPlayerUrl(game: Pick<GameRecord, "id" | "slug">, player: Pick<PlayerRecord, "id" | "private_token">): string {
  const params = new URLSearchParams({ password: player.private_token });
  const gamePath = encodeURIComponent(game.slug ?? game.id);
  return `${getSiteUrl()}/${DEFAULT_LOCALE}/games/${gamePath}/players/${encodeURIComponent(player.id)}?${params}`;
}

export type McpGame = GameRecord & { game_admin_token: string; admin_url: string };
export type McpPlayer = Omit<PlayerRecord, "avatar_image"> & {
  player_token: string;
  player_url: string;
  avatar_image: boolean;
};

/** Full game record as exposed to an authenticated admin over MCP. */
export function formatGame(game: GameRecord): McpGame {
  return {
    ...normalizeTimestamps(game),
    game_admin_token: game.private_token,
    admin_url: getGameAdminUrl(game),
  };
}

/** Public game projection (no token) with normalized timestamps. */
export function formatPublicGame<T extends object>(game: T): T {
  return normalizeTimestamps(game);
}

/** Full player record as exposed to an authenticated admin over MCP. */
export function formatPlayer(game: Pick<GameRecord, "id" | "slug">, player: PlayerRecord): McpPlayer {
  const { avatar_image, ...rest } = normalizeTimestamps(player);
  return {
    ...rest,
    avatar_image: Boolean(avatar_image),
    player_token: player.private_token,
    player_url: getPlayerUrl(game, player),
  };
}
