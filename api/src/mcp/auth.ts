import type { Container } from "../services/container.ts";
import type { GameRecord, PlayerRecord } from "@killer-game/types";

export class McpAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "McpAuthError";
  }
}

export type AdminTokenSource = "argument" | "header";

export interface AdminToken {
  value: string;
  source: AdminTokenSource;
}

/** Tool arguments that can carry the game admin token. */
export interface AdminTokenArgs {
  game_admin_token?: string;
  /** @deprecated alias of `game_admin_token`, kept for backward compatibility. */
  private_token?: string;
}

type HeaderValue = string | string[] | undefined;

/**
 * Extract the game admin token from the `Authorization` header. Both the raw
 * token and the `Bearer <token>` form are accepted, since several MCP hosts
 * (e.g. Le Chat) only offer bearer authentication.
 */
export function extractHeaderToken(headers: Record<string, HeaderValue> | undefined): string | undefined {
  if (!headers) return undefined;
  const raw = headers["authorization"] ?? headers["Authorization"];
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return undefined;
  const token = value.replace(/^Bearer\s+/i, "").trim();
  return token || undefined;
}

/**
 * Pick the token to use for an admin tool call. An explicit tool argument wins
 * over the `Authorization` header so a single session can manage several games.
 */
export function resolveAdminToken(args: AdminTokenArgs, headerToken: string | undefined): AdminToken | undefined {
  const argument = args.game_admin_token ?? args.private_token;
  if (argument) return { value: argument, source: "argument" };
  if (headerToken) return { value: headerToken, source: "header" };
  return undefined;
}

const MISSING_TOKEN_MESSAGE =
  "missing game admin token: pass `game_admin_token` (the game's private_token returned by create_game) " +
  "or configure it in the MCP client's Authorization header";

async function assertGameAdmin(container: Container, game: GameRecord, token: AdminToken | undefined): Promise<void> {
  if (!token) throw new McpAuthError(MISSING_TOKEN_MESSAGE);
  if (game.private_token === token.value) return;

  const from = token.source === "header" ? "Authorization header" : "`game_admin_token` argument";

  const player = await container.playerService.fetchByPrivateToken(token.value);
  if (player && player.game_id === game.id) {
    throw new McpAuthError(
      `invalid game admin token (from ${from}): this is a player token (returned by add_player / list_players). ` +
        "Admin tools need the game's private_token returned by create_game.",
    );
  }

  throw new McpAuthError(
    `invalid game admin token (from ${from}): expected the private_token of game "${game.slug}" as returned by create_game`,
  );
}

export async function requireGameAdmin(
  container: Container,
  gameIdOrSlug: string,
  token: AdminToken | undefined,
): Promise<GameRecord> {
  const game = await container.gameService.fetchByIdOrSlug(gameIdOrSlug);
  if (!game) throw new McpAuthError("game not found");
  await assertGameAdmin(container, game, token);
  return game;
}

export async function requirePlayerGameAdmin(
  container: Container,
  playerId: string,
  token: AdminToken | undefined,
): Promise<{ player: PlayerRecord; game: GameRecord }> {
  const player = await container.playerService.fetchById(playerId);
  if (!player) throw new McpAuthError("player not found");

  const game = await container.gameService.fetchByIdOrSlug(player.game_id);
  if (!game) throw new McpAuthError("game not found");
  await assertGameAdmin(container, game, token);
  return { player, game };
}
