import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getAdminGameShowRoute(container) {
  return {
    method: "GET",
    url: "/admin/games/:privateToken",
    schema: {},
    handler: async (req, reply) => {
      const game = await container.gameService.fetchByPrivateToken(req.params?.["privateToken"]);
      if (!game) return reply.status(404).send("game not found");

      return container.gameService.formatRecord(game);
    },
  };
}
