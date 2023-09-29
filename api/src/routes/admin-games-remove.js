import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @return {import('fastify').RouteOptions}
 */
export function getAdminGameRemoveRoute(container) {
  return {
    method: "DELETE",
    url: "/admin/games/:privateToken",

    handler: async (req, reply) => {
      const game = await container.gameService.fetchByPrivateToken(req.params?.["privateToken"]);
      if (!game) return reply.status(404).send("game not found");

      await container.gameService.remove(game);

      return "ok";
    },
  };
}
