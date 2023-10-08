import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @return {import('fastify').RouteOptions}
 */
export function getAdminGameUpdateRoute(container) {
  return {
    method: "PUT",
    url: "/games/:id",
    schema: {
      body: {
        type: "object",
        properties: {
          name: { type: "string" },
          actions: { type: "array" },
          started_at: { type: "string" },
        },
        required: ["name"],
      },
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

      ["name", "started_at"].forEach((field) => (game[field] = req.body?.[field]));

      const gameRecord = await container.gameService.update(game);

      if (!req.body?.["actions"]) return gameRecord;

      const actions = await container.gameActionsService.update(game.id, req.body?.["actions"]);

      return { data: { ...gameRecord, actions } };
    },
  };
}
