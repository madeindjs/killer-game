import type { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import type { Container } from "../services/container.js";
import { PlayerUpdateResponse } from "../schemas.js";

interface GamePlayersUpdateParams {
  gameId: string;
  playerId: string;
}

interface GamePlayersUpdateBody {
  name?: string;
  action?: string;
  avatar?: object | null;
  order?: number;
}

export function getGamePlayersUpdateRoute(container: Container): RouteOptions {
  return {
    method: "PUT",
    url: "/games/:gameId/players/:playerId",
    schema: {
      tags: ["Players"],
      description: "Update a player's name, action, avatar or order. Requires the player's private token or the game's admin token.",
      summary: "Update Player",
      params: {
        type: "object",
        properties: {
          gameId: { type: "string", description: "Game ID" },
          playerId: { type: "string", description: "Player ID" },
        },
        required: ["gameId", "playerId"],
      },
      body: {
        type: "object",
        properties: {
          name: { type: "string", description: "New player name" },
          action: { type: "string", description: "New action to perform to kill the player" },
          // players created through the API or MCP have no avatar: accept `null`
          avatar: { type: ["object", "null"], description: "react-nice-avatar configuration object" },
          order: { type: "number", description: "New player order in the game" },
        },
      },
      headers: {
        type: "object",
        properties: {
          Authorization: { type: "string", description: "Admin private token or player private token" },
        },
      },
      response: PlayerUpdateResponse,
    },
    handler: async (req: FastifyRequest, reply: FastifyReply) => {
      const params = req.params as GamePlayersUpdateParams;
      const body = (req.body ?? {}) as GamePlayersUpdateBody;

      const game = await container.gameService.fetchBy("id", params.gameId, "private_token");
      if (!game) return reply.status(404).send("game not found");

      const player = await container.playerService.fetchBy("id", params.playerId);
      if (!player) return reply.status(404).send("player not found");

      if (![player.private_token, game.private_token].includes(String(req.headers.authorization))) {
        return reply.status(403).send("token invalid");
      }

      const playerUpdated = await container.playerService.update({
        ...player,
        name: body.name ?? player.name,
        avatar: (body.avatar ?? player.avatar) as typeof player.avatar,
        action: body.action ?? player.action,
        order: body.order ?? player.order,
      });

      return { data: playerUpdated };
    },
  };
}
