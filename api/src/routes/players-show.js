import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getPlayersShowRoute(container) {
  return {
    method: "GET",
    url: "/players/:id",
    schema: {},
    handler: async (req, reply) => {
      const player = await container.playerService.fetchById(req.params?.["id"]);
      if (!player) return reply.status(404).send("player not found");

      const game = await container.gameService.fetchByIdOrSlug(player.game_id);
      if (!game) return reply.status(404).send("game not found");

      const isAdmin = player.private_token === String(req.headers.authorization);

      if (!isAdmin) return { data: container.playerService.sanitize(player) };

      return { data: player };
    },
  };
}
