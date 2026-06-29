import { Container } from "../services/container.js";
import { PlayersListResponse } from "../schemas.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getGamePlayersIndexRoute(container) {
  return {
    method: "GET",
    url: "/games/:id/players",
    schema: {
      tags: ["Players"],
      description: "List all players in a game. Admins see full records, other users see sanitized records.",
      summary: "List Players",
      params: {
        type: "object",
        properties: {
          id: { type: "string", description: "Game ID or slug" },
        },
        required: ["id"],
      },
      headers: {
        type: "object",
        properties: {
          Authorization: { type: "string", description: "Admin private token for full access" },
        },
      },
      response: PlayersListResponse,
    },
    handler: async (req, res) => {
      /** @type {{id: string}} */
      // @ts-ignore
      const params = req.params;

      const game = await container.gameService.fetchByIdOrSlug(params.id);
      if (!game) return res.status(404).send("game not found");

      const players = await container.playerService.fetchPayersByGameId(game.id);

      const isAdmin = game.private_token === String(req.headers.authorization);

      if (!isAdmin) return { data: players.map(container.playerService.sanitize) };

      return { data: players };
    },
  };
}
