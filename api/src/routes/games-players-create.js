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
          action: { type: "string" },
          avatar: { type: "object" },
        },
        required: ["name", "action"],
      },
    },
    handler: async (req, res) => {
      /** @type {{id: string}} */
      // @ts-ignore
      const params = req.params;
      /** @type {{name: string, action: string, avatar?: object}} */
      // @ts-ignore
      const body = req.body;

      const game = await container.gameService.fetchByIdOrSlug(params.id);

      if (!game) return res.status(404).send("game not found");
      if (game.started_at) return res.status(400).send("Cannot add player because game started");

      if (!game) return res.status(500).send("The game have not actions");

      const player = await container.playerService.create({
        name: body.action,
        game_id: game.id,
        action: body.action,
        avatar: body.avatar,
      });

      return { data: player };
    },
  };
}
