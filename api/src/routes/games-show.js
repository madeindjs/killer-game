import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getAdminGameShowRoute(container) {
  return {
    method: "GET",
    url: "/games/:id",
    schema: {},
    handler: async (req, reply) => {
      const game = await container.gameService.fetchById(req.params?.["id"]);
      if (!game) return reply.status(404).send("game not found");

      const isAdmin = game.private_token === String(req.headers.authorization);

      if (isAdmin) return { data: game };

      return { data: { id: game.id, name: game.name } };
    },
  };
}
