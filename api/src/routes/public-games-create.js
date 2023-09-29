import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getGamesCreateRoute(container) {
  return {
    method: "POST",
    url: "/games",
    schema: {
      body: {
        type: "object",
        properties: {
          name: { type: "string" },
          actions: { type: "array" },
        },
        required: ["name"],
      },
    },
    handler: async (req) => {
      const gameRecord = await container.gameService.create({
        name: req.body?.["name"],
        actions: req.body?.["actions"],
      });

      return container.gameService.formatRecord(gameRecord);
    },
  };
}
