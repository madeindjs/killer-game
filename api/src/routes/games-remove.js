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
      tags: ["Games"],
      description: "Delete a game. Admin access required.",
      summary: "Delete Game",
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
          Authorization: { type: "string", description: "Admin private token" },
        },
        required: ["Authorization"],
      },
    },

    handler: async (req, reply) => {
      const game = await container.gameService.fetchByIdOrSlug(req.params?.["id"]);
      if (!game) return reply.status(404).send("game not found");
      if (game.private_token !== String(req.headers.authorization)) {
        return reply.status(403).send("token invalid");
      }

      await container.gameService.remove(game);

      return { status: "success" };
    },
  };
}
