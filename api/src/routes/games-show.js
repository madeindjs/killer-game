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
      const game = await container.gameService.fetchByIdOrSlug(req.params?.["id"]);
      if (!game) return reply.status(404).send("game not found");

      const isAdmin = game.private_token === String(req.headers.authorization);

      if (!isAdmin) return { data: container.gameService.sanitize(game) };

      const actions = await container.gameActionsService.all(game.id, ["id", "name"]);
      return { data: { ...game, actions } };
    },
  };
}
