import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getAdminGamePlayersRemoveRoute(container) {
  return {
    method: "DELETE",
    url: "/games/:gameId/players/:playerId",
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
      const game = await container.playerService.fetchBy("id", req.params?.["gameId"], "private_token");
      if (!game) return reply.status(404).send("game not found");

      const player = await container.playerService.fetchBy("id", req.params?.["id"], "id");
      if (!player) return reply.status(404).send("player not found");

      if (![player.private_token, game.private_token].includes(String(req.headers.authorization))) {
        return reply.status(403).send("token invalid");
      }

      await container.playerService.remove(player);

      return "ok";
    },
  };
}
