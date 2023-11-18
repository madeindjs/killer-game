import { Container } from "../services/container.js";
import { ntfyGameStarted } from "../utils/ntfy.js";

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
        required: ["name", "actions"],
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
      if (!game) return reply.status(404).send({ error: "game not found" });
      if (game.private_token !== String(req.headers.authorization)) {
        return reply.status(403).send({ error: "token invalid" });
      }

      const wasStarted = !!game.started_at;

      game.name = req.body?.["name"];
      game.started_at = req.body?.["started_at"];

      if (req.body?.["started_at"]) {
        const players = await container.playerService.fetchPlayers(game.id);

        if (players.length < 2)
          return reply
            .status(403)
            .send({ error: { started_at: "game can't be started because there is no enough players" } });

        if (!wasStarted) ntfyGameStarted(game, players);
      }

      const gameRecord = await container.gameService.update(game);

      if (!req.body?.["actions"]) return gameRecord;

      const actions = await container.gameActionsService.update(game.id, req.body?.["actions"]);

      return { data: { ...gameRecord, actions } };
    },
  };
}
