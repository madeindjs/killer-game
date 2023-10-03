import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @return {import('fastify').RouteOptions}
 */
export function getAdminGameRemoveRoute(container) {
  return {
    method: "DELETE",
    url: "/games/:id",
    schema: {
      headers: {
        type: "object",
        properties: {
          Authorization: { type: "string" },
        },
        required: ["Authorization"],
      },
    },

    handler: async (req, reply) => {
      const game = await container.gameService.fetchById(req.params?.["id"]);
      if (!game) return reply.status(404).send("game not found");
      if (game.private_token !== String(req.headers.authorization)) {
        return reply.status(403).send("token invalid");
      }

      await container.gameService.remove(game);

      return reply.status(202).send();
    },
  };
}
