import { Container } from "../services/container.js";
import { GamesCreateResponse } from "../schemas.js";

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
          name: { type: "string", description: "Name of the game" },
          organizer_email: { type: "string", description: "Email of the game organizer" },
        },
        required: ["name"],
      },
      tags: ["Games"],
      description: "Create a new Killer game",
      summary: "Create Game",
      response: GamesCreateResponse,
    },
    handler: async (req) => {
      /** @type {import("@killer-game/types").GameCreateDTO} */
      // @ts-ignore
      const body = req.body;

      const gameRecord = await container.gameService.create({
        name: body.name,
        organizer_email: body.organizer_email,
      });

      return { data: gameRecord };
    },
  };
}
