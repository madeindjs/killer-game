import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getGamePlayersCreateRoute(container) {
  return {
    method: "POST",
    url: "/games/:id/players",
    schema: {
      body: {
        type: "object",
        properties: {
          name: { type: "string" },
          avatar: { type: "object" },
        },
        required: ["name"],
      },
    },
    handler: async (req, res) => {
      const game = await container.gameService.fetchById(req.params?.["id"]);

      if (!game) return res.status(404).send("game not found");
      if (game.started_at) return res.status(400).send("Cannot add player because game started");

      const actionId = await container.gameActionsService.getNextActions(game.id);

      if (!game) return res.status(500).send("The game have not actions");

      const player = await container.playerService.create({
        name: req.body?.["name"],
        game_id: game.id,
        action_id: actionId,
        avatar: req.body?.["avatar"],
      });

      return { data: player };
    },
  };
}
