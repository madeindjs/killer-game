import { Container } from "../services/container.js";

/**
 * @param {Container} container
 */
export function getPlayerRoutes(container) {
  /**
   * @type {import('fastify').RouteOptions}
   */
  const createByGamePublicToken = {
    method: "POST",
    url: "/games/by-public-token/:publicToken/players",
    schema: {
      body: {
        type: "object",
        properties: {
          name: { type: "string" },
        },
        required: ["name"],
      },
    },
    handler: async (req, res) => {
      const game = await container.gameService.fetchByPublicToken(req.params?.["publicToken"]);

      if (!game) {
        return res.status(404).send("game not found");
      }

      return container.playerService.create({ name: req.body?.["name"], game_id: game.id });
    },
  };

  /**
   * @type {import('fastify').RouteOptions}
   */
  const getGamesPlayersByGamePublicToken = {
    method: "GET",
    url: "/games/by-public-token/:publicToken/players",
    handler: async (req, res) => {
      const game = await container.gameService.fetchByPublicToken(req.params?.["publicToken"]);

      if (!game) {
        return res.status(404).send("game not found");
      }

      return container.playerService.fetchPayersByGameId(game.id);
    },
  };

  return { createByGamePublicToken, getGamesPlayersByGamePublicToken };
}
