import { Container } from "../services/container.js";
import { PlayerCreateResponse } from "../schemas.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getGamePlayersCreateRoute(container) {
  return {
    method: "POST",
    url: "/games/:id/players",
    schema: {
      tags: ["Players"],
      description: "Add a new player to a game. Only possible before the game has started.",
      summary: "Create Player",
      body: {
        type: "object",
        properties: {
          name: { type: "string", description: "Player name" },
          action: { type: "string", description: "Action the next player must perform on this player" },
          avatar: { type: "object", description: "react-nice-avatar configuration object" },
        },
        required: ["name", "action"],
      },
      response: PlayerCreateResponse,
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
        name: body.name,
        game_id: game.id,
        action: body.action,
        avatar: body.avatar,
      });

      return { data: player };
    },
  };
}
