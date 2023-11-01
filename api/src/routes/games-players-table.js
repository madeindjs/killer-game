import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getGamePlayersTableRoute(container) {
  return {
    method: "GET",
    url: "/games/:id/players/table",
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
      const game = await container.gameService.fetchById(req.params?.["id"]);
      if (!game) return reply.status(404).send("game not found");
      if (game.private_token !== String(req.headers.authorization)) return reply.status(403).send({});

      const actions = await container.gameActionsService.all(game.id);
      const players = await container.playerService.fetchPlayers(game.id);

      /**
       * @param {string} actionId
       * @returns {import("@killer-game/types").GameActionRecord}
       */
      function findAction(actionId) {
        // @ts-ignore
        return actions.find(({ id }) => id === actionId);
      }

      const orderList = players.map((p) => p.order);
      const minOrder = Math.min(...orderList);
      const maxOrder = Math.max(...orderList);

      /**
       * @param {number} order
       * @returns {import("@killer-game/types").PlayerRecord}
       */
      function findNextPlayer(order) {
        const nextOrder = order + 1 <= maxOrder ? order + 1 : minOrder;

        const nextPlayer = players.find((p) => p.order === nextOrder);
        if (nextPlayer) return nextPlayer;

        return findNextPlayer(nextOrder);
      }

      /** @type {import("@killer-game/types").GamePlayersTable} */
      const table = players.map((player) => ({
        player,
        target: findNextPlayer(player.order),
        action: findAction(player.action_id),
      }));

      return { data: table };
    },
  };
}
