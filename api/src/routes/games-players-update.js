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
          order: { type: "number" },
        },
      },
    },
    handler: async (req, reply) => {
      /** @type {{gameId: string, playerId: string}} */
      // @ts-ignore
      const params = req.params;
      /** @type {{name?: string, action?: string, avatar?: object, order?: number}} */
      // @ts-ignore
      const body = req.body;
      /** @type {{displayAllPlayers?: boolean}} */
      // @ts-ignore
      const query = req.query;

      const game = await container.gameService.fetchBy("id", params.gameId, "private_token");
      if (!game) return reply.status(404).send("game not found");

      const player = await container.playerService.fetchBy("id", params.playerId);
      if (!player) return reply.status(404).send("player not found");

      if (![player.private_token, game.private_token].includes(String(req.headers.authorization))) {
        return reply.status(403).send("token invalid");
      }

      const playerUpdated = await container.playerService.update({
        ...player,
        name: body.name ?? player.name,
        avatar: body.avatar ?? player.avatar,
        action: body.action ?? body.action ?? "???",
        order: body.order ?? player.order,
      });

      return { data: playerUpdated };
    },
  };
}
