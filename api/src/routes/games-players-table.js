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
      querystring: {
        type: "object",
        properties: {
          displayAllPlayers: { type: "boolean" },
        },
      },
    },
    handler: async (req, reply) => {
      /** @type {{id: string}} */
      // @ts-ignore
      const params = req.params;
      /** @type {{name: string, action: string, avatar?: object}} */
      // @ts-ignore
      const body = req.body;
      /** @type {{displayAllPlayers?: boolean}} */
      // @ts-ignore
      const query = req.query;

      const game = await container.gameService.fetchByIdOrSlug(params.id);
      if (!game) return reply.status(404).send("game not found");
      if (game.private_token !== String(req.headers.authorization)) return reply.status(403).send({});

      const displayAllPlayers = Boolean(query.displayAllPlayers);

      const players = await container.playerService.fetchPayersByGameId(game.id);

      const orderList = players.map((p) => p.order);
      const minOrder = Math.min(...orderList);
      const maxOrder = Math.max(...orderList);

      /**
       * @param {import("@killer-game/types").PlayerRecord} player
       */
      function canDisplayPlayer(player) {
        if (displayAllPlayers) return true;
        return !player.killed_at;
      }

      /**
       * @param {number} order
       * @returns {import("@killer-game/types").PlayerRecord}
       */
      function findNextPlayer(order) {
        const nextOrder = order + 1 <= maxOrder ? order + 1 : minOrder;

        const nextPlayer = players.find((p) => p.order === nextOrder && canDisplayPlayer(p));
        if (nextPlayer) return nextPlayer;

        return findNextPlayer(nextOrder);
      }

      /** @type {import("@killer-game/types").GamePlayersTable} */
      const table = players.filter(canDisplayPlayer).map((player) => {
        const target = findNextPlayer(player.order);
        const action = target.action;
        return { player, target, action };
      });

      return { data: table };
    },
  };
}
