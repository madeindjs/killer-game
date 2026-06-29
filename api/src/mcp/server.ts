import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { Container } from "../services/container.js";
import { McpAuthError, requireGameAdmin, requirePlayerGameAdmin } from "./auth.ts";

export function createMcpServer(container: Container, version: string): McpServer {
  const server = new McpServer(
    { name: "killer-game", version },
    {
      instructions:
        "Tools for managing Killer party games. Admin tools require the game private_token as an argument, exactly as returned when the game was created.",
    },
  );

  const textResult = (data: unknown) => ({
    content: [{ type: "text" as const, text: JSON.stringify(data) }],
  });

  const errorResult = (message: string) => ({
    content: [{ type: "text" as const, text: message }],
    isError: true,
  });

  // Game admin tools

  server.registerTool(
    "create_game",
    {
      title: "Create Game",
      description: "Create a new Killer party game. Returns the full game record including the private admin token.",
      inputSchema: z.object({
        name: z.string().min(1).describe("Name of the game"),
        organizer_email: z.string().email().optional().describe("Email of the game organizer"),
      }),
    },
    async ({ name, organizer_email }) => {
      const game = await container.gameService.create({ name, organizer_email });
      return textResult(game);
    },
  );

  server.registerTool(
    "get_game",
    {
      title: "Get Game",
      description:
        "Get a game by ID or slug. Provide the game private_token for full details; otherwise only public fields are returned.",
      inputSchema: z.object({
        id_or_slug: z.string().describe("Game ID or slug"),
        private_token: z.string().optional().describe("Game private admin token. If provided and valid, the full game record is returned."),
      }),
    },
    async ({ id_or_slug, private_token }) => {
      const game = await container.gameService.fetchByIdOrSlug(id_or_slug);
      if (!game) return errorResult("game not found");
      if (private_token && game.private_token === private_token) {
        return textResult(game);
      }
      return textResult(container.gameService.sanitize(game));
    },
  );

  server.registerTool(
    "update_game",
    {
      title: "Update Game",
      description: "Rename a game or set its start timestamp. Requires the game private_token.",
      inputSchema: z.object({
        id_or_slug: z.string().describe("Game ID or slug"),
        private_token: z.string().describe("Game private admin token"),
        name: z.string().min(1).optional().describe("New game name"),
        started_at: z.string().datetime().optional().describe("ISO timestamp when the game starts"),
      }),
    },
    async ({ id_or_slug, private_token, name, started_at }) => {
      try {
        const game = await requireGameAdmin(container, id_or_slug, private_token);

        if (started_at) {
          const players = await container.playerService.fetchPlayers(game.id);
          if (players.length < 2) {
            return errorResult("game can't be started because there are not enough players");
          }
        }

        if (name !== undefined) game.name = name;
        if (started_at !== undefined) game.started_at = started_at;

        const updated = await container.gameService.update(game);
        return textResult(updated);
      } catch (error) {
        return errorResult(error instanceof McpAuthError ? error.message : "failed to update game");
      }
    },
  );

  server.registerTool(
    "delete_game",
    {
      title: "Delete Game",
      description: "Delete a game and all its players. Requires the game private_token.",
      inputSchema: z.object({
        id_or_slug: z.string().describe("Game ID or slug"),
        private_token: z.string().describe("Game private admin token"),
      }),
      annotations: {
        destructiveHint: true,
      },
    },
    async ({ id_or_slug, private_token }) => {
      try {
        const game = await requireGameAdmin(container, id_or_slug, private_token);
        await container.gameService.remove(game);
        return textResult({ success: true });
      } catch (error) {
        return errorResult(error instanceof McpAuthError ? error.message : "failed to delete game");
      }
    },
  );

  server.registerTool(
    "start_game",
    {
      title: "Start Game",
      description:
        "Start a game by setting its start timestamp to now. Requires the game private_token and at least 2 players.",
      inputSchema: z.object({
        id_or_slug: z.string().describe("Game ID or slug"),
        private_token: z.string().describe("Game private admin token"),
      }),
    },
    async ({ id_or_slug, private_token }) => {
      try {
        const game = await requireGameAdmin(container, id_or_slug, private_token);
        const players = await container.playerService.fetchPlayers(game.id);
        if (players.length < 2) {
          return errorResult("game can't be started because there are not enough players");
        }
        game.started_at = new Date().toISOString();
        const updated = await container.gameService.update(game);
        return textResult(updated);
      } catch (error) {
        return errorResult(error instanceof McpAuthError ? error.message : "failed to start game");
      }
    },
  );

  // Player admin tools

  server.registerTool(
    "list_players",
    {
      title: "List Players",
      description: "List all players in a game. Requires the game private_token for full records.",
      inputSchema: z.object({
        game_id_or_slug: z.string().describe("Game ID or slug"),
        private_token: z.string().describe("Game private admin token"),
      }),
    },
    async ({ game_id_or_slug, private_token }) => {
      try {
        const game = await requireGameAdmin(container, game_id_or_slug, private_token);
        const players = await container.playerService.fetchPayersByGameId(game.id);
        return textResult({ data: players });
      } catch (error) {
        return errorResult(error instanceof McpAuthError ? error.message : "failed to list players");
      }
    },
  );

  server.registerTool(
    "add_player",
    {
      title: "Add Player",
      description: "Add a player to a game. Requires the game private_token. Returns the player record including the private token.",
      inputSchema: z.object({
        game_id_or_slug: z.string().describe("Game ID or slug"),
        private_token: z.string().describe("Game private admin token"),
        name: z.string().min(1).describe("Player name"),
        action: z.string().min(1).optional().describe("Elimination task assigned to this player"),
      }),
    },
    async ({ game_id_or_slug, private_token, name, action }) => {
      try {
        const game = await requireGameAdmin(container, game_id_or_slug, private_token);
        const player = await container.playerService.create({ game_id: game.id, name, action });
        return textResult(player);
      } catch (error) {
        return errorResult(error instanceof McpAuthError ? error.message : "failed to add player");
      }
    },
  );

  server.registerTool(
    "update_player",
    {
      title: "Update Player",
      description: "Update a player's name or action. Requires the game private_token.",
      inputSchema: z.object({
        player_id: z.string().describe("Player ID"),
        private_token: z.string().describe("Game private admin token"),
        name: z.string().min(1).optional().describe("New player name"),
        action: z.string().min(1).optional().describe("New elimination task"),
      }),
    },
    async ({ player_id, private_token, name, action }) => {
      try {
        const { player } = await requirePlayerGameAdmin(container, player_id, private_token);
        if (name !== undefined) player.name = name;
        if (action !== undefined) player.action = action;
        const updated = await container.playerService.update(player);
        return textResult(updated);
      } catch (error) {
        return errorResult(error instanceof McpAuthError ? error.message : "failed to update player");
      }
    },
  );

  server.registerTool(
    "remove_player",
    {
      title: "Remove Player",
      description: "Remove a player from a game. Requires the game private_token.",
      inputSchema: z.object({
        player_id: z.string().describe("Player ID"),
        private_token: z.string().describe("Game private admin token"),
      }),
      annotations: {
        destructiveHint: true,
      },
    },
    async ({ player_id, private_token }) => {
      try {
        const { player } = await requirePlayerGameAdmin(container, player_id, private_token);
        await container.playerService.remove(player);
        return textResult({ success: true });
      } catch (error) {
        return errorResult(error instanceof McpAuthError ? error.message : "failed to remove player");
      }
    },
  );

  return server;
}
