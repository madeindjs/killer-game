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
      /** @type {{id: string}} */
      // @ts-ignore
      const params = req.params;
      const player = await container.playerService.fetchById(params.id);
      if (!player) return reply.status(404).send("player not found");

      const isAdmin = player.private_token === String(req.headers.authorization);
      if (!isAdmin) return reply.status(403).send("You cannot access this endpoint");

      const target = await container.playerService.getCurrentTarget(player);
      const action = target?.action;

      const playersKilled = await container.playerService.fetchPlayersKilled(player.id);

      /** @type {import("@killer-game/types").PlayerStatus['kills']} */
      const kills = playersKilled.map((p) => ({
        player: container.playerService.sanitize(p),
        action: p.action,
      }));

      /** @type {import("@killer-game/types").PlayerStatus} */
      const response = {
        current: {
          player: target ? container.playerService.sanitize(target) : undefined,
          action: action,
        },
        kills,
      };

      return {
        data: response,
      };
    },
  };
}
