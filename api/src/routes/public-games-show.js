import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getGamesShowRoute(container) {
  return {
    method: "GET",
    url: "/games/:publicToken",
    schema: {},
    handler: async (req, reply) => {
      const game = await container.gameService.fetchByPublicToken(req.params?.["publicToken"]);
      if (!game) return reply.status(404).send("game not found");

      return container.gameService.formatRecordForPublic(game);
    },
  };
}
