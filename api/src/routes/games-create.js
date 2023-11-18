import { Container } from "../services/container.js";
import { ntfyGameCreated } from "../utils/ntfy.js";

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
      });

      ntfyGameCreated(gameRecord);

      if (req.body?.["actions"] && Array.isArray(req.body?.["actions"]) && req.body?.["actions"].length > 0) {
        const actions = await container.gameActionsService.create(gameRecord.id, req.body?.["actions"]);
        return { data: { ...gameRecord, actions } };
      }

      return { data: gameRecord };
    },
  };
}
