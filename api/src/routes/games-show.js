import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getAdminGameShowRoute(container) {
  return {
    method: "GET",
    url: "/games/:id",
    schema: {
      tags: ["Games"],
      description: "Get game details by ID or slug. Returns sanitized data for non-admin users.",
      summary: "Get Game",
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
    },
    handler: async (req, reply) => {
      /** @type {{id: string}} */
      // @ts-ignore
      const params = req.params;

      const game = await container.gameService.fetchByIdOrSlug(params.id);
      if (!game) return reply.status(404).send("game not found");

      const isAdmin = game.private_token === String(req.headers.authorization);

      if (!isAdmin) return { data: container.gameService.sanitize(game) };

      return { data: game };
    },
  };
}
