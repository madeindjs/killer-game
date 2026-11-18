import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { GameRecord, PlayerRecord } from "@killer-game/types";

import type { Container } from "../services/container.ts";
import { ntfyGameFinished, ntfyGameStarted } from "../utils/ntfy.js";
import {
  type AdminToken,
  type AdminTokenArgs,
  extractHeaderToken,
  McpAuthError,
  requireGameAdmin,
  requirePlayerGameAdmin,
  resolveAdminToken,
} from "./auth.ts";
import { formatGame, formatPlayer, formatPublicGame } from "./format.ts";

const INSTRUCTIONS = [
  "Tools for creating and running Killer party games.",
  "Admin tools need the game admin token: the `private_token` returned by create_game (also exposed as `game_admin_token`).",
  "Pass it as the `game_admin_token` argument, or configure it once in the MCP client's `Authorization` header (raw token or `Bearer <token>`); an explicit argument wins over the header.",
  "Player records also contain a `player_token` / `private_token`: that is the player's personal token and is NOT accepted by admin tools.",
  "Game records include an `admin_url` to open the organizer dashboard in a browser; player records include a `player_url` to share with each player.",
  "Typical flow: create_game -> add_player (x2 or more) -> start_game -> eliminate_player ... -> the game finishes automatically when one player is left (or call finish_game).",
  "All timestamps are ISO 8601 UTC.",
].join(" ");

const NOT_ENOUGH_PLAYERS = "game can't be started because there are not enough players";

const adminTokenShape = {
  game_admin_token: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Game admin token (the private_token returned by create_game). Optional when the MCP client sends it in the Authorization header.",
    ),
  private_token: z.string().min(1).optional().describe("Deprecated alias of game_admin_token."),
};

type ToolExtra = { requestInfo?: { headers?: Record<string, string | string[] | undefined> } };

function getAdminToken(args: AdminTokenArgs, extra: ToolExtra): AdminToken | undefined {
  return resolveAdminToken(args, extractHeaderToken(extra.requestInfo?.headers));
}

export function createMcpServer(container: Container, version: string): McpServer {
  const server = new McpServer({ name: "killer-game", version }, { instructions: INSTRUCTIONS });

  const textResult = (data: unknown) => ({
    content: [{ type: "text" as const, text: JSON.stringify(data) }],
  });

  const errorResult = (message: string) => ({
    content: [{ type: "text" as const, text: message }],
    isError: true,
  });

  const handleError = (error: unknown, fallback: string) => {
    if (error instanceof McpAuthError) return errorResult(error.message);
    container.logger.error(error);
    return errorResult(fallback);
  };

  const finishGame = async (game: GameRecord, finishedAt: string): Promise<GameRecord> => {
    const updated = await container.gameService.update({ ...game, finished_at: finishedAt });
    ntfyGameFinished(updated, await container.playerService.fetchPlayers(game.id));
    return updated;
  };

  // Game admin tools

  server.registerTool(
    "create_game",
    {
      title: "Create Game",
      description:
        "Create a new Killer party game. Returns the full game record, including `private_token` / `game_admin_token` (needed by every admin tool) and `admin_url` (organizer dashboard link).",
      inputSchema: z.object({
        name: z.string().min(1).describe("Name of the game"),
        organizer_email: z.string().email().optional().describe("Email of the game organizer"),
      }),
    },
    async ({ name, organizer_email }) => {
      const game = await container.gameService.create({ name, organizer_email });
      return textResult(formatGame(game));
    },
  );

  server.registerTool(
    "list_games",
    {
      title: "List Games",
      description:
        "List the games the given admin token grants access to. A token belongs to exactly one game, so this returns zero or one game; it is mainly useful to discover the game slug when the token is configured in the Authorization header.",
      inputSchema: z.object({ ...adminTokenShape }),
      annotations: { readOnlyHint: true },
    },
    async (args, extra) => {
      const token = getAdminToken(args, extra);
      if (!token) return errorResult("missing game admin token: pass `game_admin_token` or configure the Authorization header");
      const game = await container.gameService.fetchByPrivateToken(token.value);
      return textResult({ data: game ? [formatGame(game)] : [] });
    },
  );

  server.registerTool(
    "get_game",
    {
      title: "Get Game",
      description:
        "Get a game by ID or slug. With a valid game admin token the full record is returned (including admin_url); without a token only public fields are returned. An explicit but invalid game_admin_token is an error.",
      inputSchema: z.object({
        id_or_slug: z.string().describe("Game ID or slug"),
        ...adminTokenShape,
      }),
      annotations: { readOnlyHint: true },
    },
    async (args, extra) => {
      const game = await container.gameService.fetchByIdOrSlug(args.id_or_slug);
      if (!game) return errorResult("game not found");

      const token = getAdminToken(args, extra);
      if (token?.value === game.private_token) return textResult(formatGame(game));

      // A token passed explicitly for this call must be valid. A header token may
      // belong to another game, so it silently falls back to the public view.
      if (token?.source === "argument") {
        try {
          await requireGameAdmin(container, game.id, token);
        } catch (error) {
          return handleError(error, "failed to get game");
        }
      }

      return textResult(formatPublicGame(container.gameService.sanitize(game)));
    },
  );

  server.registerTool(
    "update_game",
    {
      title: "Update Game",
      description: "Rename a game or set its start timestamp. Requires the game admin token.",
      inputSchema: z.object({
        id_or_slug: z.string().describe("Game ID or slug"),
        ...adminTokenShape,
        name: z.string().min(1).optional().describe("New game name"),
        started_at: z.string().datetime().optional().describe("ISO timestamp when the game starts"),
      }),
    },
    async (args, extra) => {
      try {
        const game = await requireGameAdmin(container, args.id_or_slug, getAdminToken(args, extra));

        if (args.started_at) {
          const players = await container.playerService.fetchPlayers(game.id);
          if (players.length < 2) return errorResult(NOT_ENOUGH_PLAYERS);
        }

        if (args.name !== undefined) game.name = args.name;
        if (args.started_at !== undefined) game.started_at = args.started_at;

        const updated = await container.gameService.update(game);
        return textResult(formatGame(updated));
      } catch (error) {
        return handleError(error, "failed to update game");
      }
    },
  );

  server.registerTool(
    "delete_game",
    {
      title: "Delete Game",
      description: "Delete a game and all its players. Requires the game admin token.",
      inputSchema: z.object({
        id_or_slug: z.string().describe("Game ID or slug"),
        ...adminTokenShape,
      }),
      annotations: { destructiveHint: true },
    },
    async (args, extra) => {
      try {
        const game = await requireGameAdmin(container, args.id_or_slug, getAdminToken(args, extra));
        await container.gameService.remove(game);
        return textResult({ success: true });
      } catch (error) {
        return handleError(error, "failed to delete game");
      }
    },
  );

  server.registerTool(
    "start_game",
    {
      title: "Start Game",
      description:
        "Start a game by setting its start timestamp to now. Requires the game admin token and at least 2 players. Targets are revealed to players only once the game is started.",
      inputSchema: z.object({
        id_or_slug: z.string().describe("Game ID or slug"),
        ...adminTokenShape,
        shuffle: z
          .boolean()
          .optional()
          .describe("Randomly reassign the whole chain of targets before starting (only when the game is not started yet)"),
      }),
    },
    async (args, extra) => {
      try {
        const game = await requireGameAdmin(container, args.id_or_slug, getAdminToken(args, extra));
        if (game.finished_at) return errorResult("the game is finished");
        const players = await container.playerService.fetchPlayers(game.id);
        if (players.length < 2) return errorResult(NOT_ENOUGH_PLAYERS);

        const wasStarted = !!game.started_at;
        if (args.shuffle && !wasStarted) await container.playerService.shuffleOrder(game.id);
        game.started_at = new Date().toISOString();
        const updated = await container.gameService.update(game);
        if (!wasStarted) ntfyGameStarted(updated, players);
        return textResult(formatGame(updated));
      } catch (error) {
        return handleError(error, "failed to start game");
      }
    },
  );

  server.registerTool(
    "finish_game",
    {
      title: "Finish Game",
      description:
        "End a started game now, even if several players are still alive. Games also finish automatically when eliminate_player leaves a single survivor. Requires the game admin token.",
      inputSchema: z.object({
        id_or_slug: z.string().describe("Game ID or slug"),
        ...adminTokenShape,
      }),
    },
    async (args, extra) => {
      try {
        const game = await requireGameAdmin(container, args.id_or_slug, getAdminToken(args, extra));
        if (!game.started_at) return errorResult("the game has not started yet");
        if (game.finished_at) return errorResult("the game is already finished");
        const updated = await finishGame(game, new Date().toISOString());
        return textResult(formatGame(updated));
      } catch (error) {
        return handleError(error, "failed to finish game");
      }
    },
  );

  // Player admin tools

  server.registerTool(
    "list_players",
    {
      title: "List Players",
      description:
        "List all players in a game with their full records (action, kill status, player_token, player_url). Requires the game admin token.",
      inputSchema: z.object({
        game_id_or_slug: z.string().describe("Game ID or slug"),
        ...adminTokenShape,
      }),
      annotations: { readOnlyHint: true },
    },
    async (args, extra) => {
      try {
        const game = await requireGameAdmin(container, args.game_id_or_slug, getAdminToken(args, extra));
        const players = await container.playerService.fetchPayersByGameId(game.id);
        return textResult({ data: players.map((player) => formatPlayer(game, player)) });
      } catch (error) {
        return handleError(error, "failed to list players");
      }
    },
  );

  server.registerTool(
    "add_player",
    {
      title: "Add Player",
      description:
        "Add a player to a game. Requires the game admin token. Returns the player record, including the player's own `player_token` (not usable for admin tools) and a `player_url` to share with them.",
      inputSchema: z.object({
        game_id_or_slug: z.string().describe("Game ID or slug"),
        ...adminTokenShape,
        name: z.string().min(1).describe("Player name"),
        action: z.string().min(1).optional().describe("Elimination task assigned to this player"),
      }),
    },
    async (args, extra) => {
      try {
        const game = await requireGameAdmin(container, args.game_id_or_slug, getAdminToken(args, extra));
        const player = await container.playerService.create({
          game_id: game.id,
          name: args.name,
          action: args.action,
        } as Parameters<typeof container.playerService.create>[0]);
        return textResult(formatPlayer(game, player));
      } catch (error) {
        return handleError(error, "failed to add player");
      }
    },
  );

  server.registerTool(
    "update_player",
    {
      title: "Update Player",
      description: "Update a player's name or action. Requires the game admin token.",
      inputSchema: z.object({
        player_id: z.string().describe("Player ID"),
        ...adminTokenShape,
        name: z.string().min(1).optional().describe("New player name"),
        action: z.string().min(1).optional().describe("New elimination task"),
      }),
    },
    async (args, extra) => {
      try {
        const { player, game } = await requirePlayerGameAdmin(container, args.player_id, getAdminToken(args, extra));
        if (args.name !== undefined) player.name = args.name;
        if (args.action !== undefined) player.action = args.action;
        const updated = await container.playerService.update(player);
        return textResult(formatPlayer(game, updated));
      } catch (error) {
        return handleError(error, "failed to update player");
      }
    },
  );

  server.registerTool(
    "remove_player",
    {
      title: "Remove Player",
      description: "Remove a player from a game. Requires the game admin token.",
      inputSchema: z.object({
        player_id: z.string().describe("Player ID"),
        ...adminTokenShape,
      }),
      annotations: { destructiveHint: true },
    },
    async (args, extra) => {
      try {
        const { player } = await requirePlayerGameAdmin(container, args.player_id, getAdminToken(args, extra));
        await container.playerService.remove(player);
        return textResult({ success: true });
      } catch (error) {
        return handleError(error, "failed to remove player");
      }
    },
  );

  server.registerTool(
    "eliminate_player",
    {
      title: "Eliminate Player",
      description:
        "Record the elimination of a player in a started game. The kill is credited to the previous player still alive in the circle (the one who had this player as target), exactly as when a player confirms a kill in the app. When only one player remains, the game finishes automatically. Requires the game admin token.",
      inputSchema: z.object({
        player_id: z.string().describe("ID of the player who has been eliminated"),
        ...adminTokenShape,
      }),
    },
    async (args, extra) => {
      try {
        const { player: target, game } = await requirePlayerGameAdmin(
          container,
          args.player_id,
          getAdminToken(args, extra),
        );
        if (!game.started_at) return errorResult("the game has not started yet");
        if (game.finished_at) return errorResult("the game is finished");
        if (target.killed_at) return errorResult("the player is already eliminated");

        const killer = await container.playerService.getPreviousPlayerAlive(target);
        if (!killer || killer.id === target.id) return errorResult("cannot find the previous player alive");

        const now = new Date().toISOString();
        const eliminated = await container.playerService.update({ ...target, killed_at: now, killed_by: killer.id });

        const players = await container.playerService.fetchPlayers(game.id);
        const alive = players.filter((p: PlayerRecord) => !p.killed_at);

        let updatedGame = game;
        if (alive.length <= 1) updatedGame = await finishGame(game, now);

        return textResult({
          player: formatPlayer(game, eliminated),
          killed_by: formatPlayer(game, killer),
          game_finished: !!updatedGame.finished_at,
          winner: updatedGame.finished_at && alive[0] ? formatPlayer(game, alive[0]) : null,
          game: formatGame(updatedGame),
        });
      } catch (error) {
        return handleError(error, "failed to eliminate player");
      }
    },
  );

  return server;
}
