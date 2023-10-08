import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getGamePlayersIndexRoute(container) {
  return {
    method: "GET",
    url: "/games/:id/players",
    handler: async (req, res) => {
      const game = await container.gameService.fetchById(req.params?.["id"]);
      if (!game) return res.status(404).send("game not found");

      const players = await container.playerService.fetchPayersByGameId(game.id);

      const isAdmin = game.private_token === String(req.headers.authorization);

      if (!isAdmin) {
        return {
          data: players.map((player) => ({ name: player.name, id: player.id, avatar: player.avatar })),
        };
      }

      return {
        data: players,
        includes: await container.gameActionsService.all(game.id),
      };
    },
  };
}
