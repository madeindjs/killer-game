import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getGamePlayersCreateRoute(container) {
  return {
    method: "POST",
    url: "/games/:publicToken/players",
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
}
