import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getGamePlayersUpdateRoute(container) {
  return {
    method: "PUT",
    url: "/games/:gameId/players/:playerId",
    schema: {
      body: {
        type: "object",
        properties: {
          name: { type: "string" },
          avatar: { type: "object" },
        },
      },
    },
    handler: async (req, reply) => {
      const game = await container.gameService.fetchBy("id", req.params?.["gameId"], "private_token");
      if (!game) return reply.status(404).send("game not found");

      const player = await container.playerService.fetchBy("id", req.params?.["playerId"], "id");
      if (!player) return reply.status(404).send("player not found");

      if (![player.private_token, game.private_token].includes(String(req.headers.authorization))) {
        return reply.status(403).send("token invalid");
      }

      const playerUpdated = await container.playerService.update({
        ...player,
        name: req.body?.["name"],

        avatar: req.body?.["avatar"],
      });

      return { data: playerUpdated };
    },
  };
}
