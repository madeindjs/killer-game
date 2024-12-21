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
        },
        required: ["name"],
      },
    },
    handler: async (req) => {
      /** @type {import("@killer-game/types").GameCreateDTO} */
      // @ts-ignore
      const body = req.body;

      const gameRecord = await container.gameService.create({
        name: body.name,
      });

      return { data: gameRecord };
    },
  };
}
