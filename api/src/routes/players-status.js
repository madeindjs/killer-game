import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getPlayersStatusRoute(container) {
  return {
    method: "GET",
    url: "/players/:id/status",
    schema: {
      headers: {
        type: "object",
        properties: {
          Authorization: { type: "string" },
        },
        required: ["Authorization"],
      },
    },
    handler: async (req, reply) => {
      const player = await container.playerService.fetchById(req.params?.["id"]);
      if (!player) return reply.status(404).send("player not found");

      const isAdmin = player.private_token === String(req.headers.authorization);
      if (!isAdmin) return reply.status(403).send("You cannot access this endpoint");

      const target = await container.playerService.getCurrentTarget(player);
      // TODO: handle next cards
      const action = await container.gameActionsService.fetchById(player.action_id);

      /** @type {import("@killer-game/types").PlayerStatus} */
      const response = {
        current: {
          player: target ? container.playerService.sanitize(target) : undefined,
          action: action,
        },
      };

      return {
        data: response,
      };
    },
  };
}
