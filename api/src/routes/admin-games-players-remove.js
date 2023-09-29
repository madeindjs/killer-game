import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getAdminGamePlayersRemoveRoute(container) {
  return {
    method: "DELETE",
    url: "/admin/games/:gamePrivateToken/players/:privateToken",
    schema: {},
    handler: async (req, reply) => {
      const player = await container.playerService.fetchByPrivateToken(req.params?.["privateToken"], "id");

      if (!player) return reply.status(404).send("player not found");

      await container.playerService.remove(player);

      return "ok";
    },
  };
}
