import type { Container } from "../services/container.js";
import type { GameRecord, PlayerRecord } from "@killer-game/types";

export class McpAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "McpAuthError";
  }
}

export async function requireGameAdmin(
  container: Container,
  gameIdOrSlug: string,
  authToken: string,
): Promise<GameRecord> {
  const game = await container.gameService.fetchByIdOrSlug(gameIdOrSlug);
  if (!game) throw new McpAuthError("game not found");
  if (game.private_token !== authToken) {
    throw new McpAuthError("invalid game admin token");
  }
  return game;
}

export async function requirePlayerGameAdmin(
  container: Container,
  playerId: string,
  authToken: string,
): Promise<{ player: PlayerRecord; game: GameRecord }> {
  const player = await container.playerService.fetchById(playerId);
  if (!player) throw new McpAuthError("player not found");

  const game = await container.gameService.fetchByIdOrSlug(player.game_id);
  if (!game) throw new McpAuthError("game not found");
  if (game.private_token !== authToken) {
    throw new McpAuthError("invalid game admin token");
  }
  return { player, game };
}
