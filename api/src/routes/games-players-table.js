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
      const game = await container.gameService.fetchByIdOrSlug(req.params?.["id"]);
      if (!game) return reply.status(404).send("game not found");
      if (game.private_token !== String(req.headers.authorization)) return reply.status(403).send({});

      const displayAllPlayers = Boolean(req.query?.["displayAllPlayers"]);

      const actions = await container.gameActionsService.all(game.id);
      const players = await container.playerService.fetchPayersByGameId(game.id);

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
        const action = findAction(target.action_id);
        return { player, target, action };
      });

      return { data: table };
    },
  };
}
