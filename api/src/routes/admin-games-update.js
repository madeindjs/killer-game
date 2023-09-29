import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @return {import('fastify').RouteOptions}
 */
export function getAdminGameUpdateRoute(container) {
  return {
    method: "PUT",
    url: "/admin/games/:privateToken",
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
    handler: async (req, reply) => {
      const game = await container.gameService.fetchByPrivateToken(req.params?.["privateToken"]);
      if (!game) return reply.status(404).send("game not found");

      ["name"].filter((field) => req.body?.[field]).forEach((field) => (game[field] = req.body?.[field]));

      if (req.body?.["name"]) game.name = req.body?.["name"];

      const gameRecord = await container.gameService.update(game);

      if (!req.body?.["actions"]) return gameRecord;

      const actions = await container.gameActionsService.update(game.id, req.body?.["actions"]);

      return { ...gameRecord, actions };
    },
  };
}
