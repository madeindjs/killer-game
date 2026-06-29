import { Container } from "../services/container.js";
import { PlayerRemoveResponse } from "../schemas.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getAdminGamePlayersRemoveRoute(container) {
  return {
    method: "DELETE",
    url: "/games/:gameId/players/:playerId",
    schema: {
      tags: ["Players"],
      description: "Remove a player from a game. Requires the player's private token or the game's admin token.",
      summary: "Remove Player",
      params: {
        type: "object",
        properties: {
          gameId: { type: "string", description: "Game ID" },
          playerId: { type: "string", description: "Player ID" },
        },
        required: ["gameId", "playerId"],
      },
      headers: {
        type: "object",
        properties: {
          Authorization: { type: "string", description: "Admin private token or player private token" },
        },
        required: ["Authorization"],
      },
      response: PlayerRemoveResponse,
    },
    handler: async (req, reply) => {
      const game = await container.gameService.fetchBy("id", req.params?.["gameId"], "private_token");
      if (!game) return reply.status(404).send("game not found");

      const player = await container.playerService.fetchBy("id", req.params?.["playerId"], ["id", "game_id", "name"]);
      if (!player) return reply.status(404).send("player not found");

      if (![player.private_token, game.private_token].includes(String(req.headers.authorization))) {
        return reply.status(403).send("token invalid");
      }

      await container.playerService.remove(player);

      return reply.status(202).send();
    },
  };
}
