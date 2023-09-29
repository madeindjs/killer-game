import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getGamePlayersIndexRoute(container) {
  return {
    method: "GET",
    url: "/games/:publicToken/players",
    handler: async (req, res) => {
      const game = await container.gameService.fetchByPublicToken(req.params?.["publicToken"]);

      if (!game) {
        return res.status(404).send("game not found");
      }

      const players = await container.playerService.fetchPayersByGameId(game.id);
    },
  };
}
