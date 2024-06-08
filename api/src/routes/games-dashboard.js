import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getGameDashboardRoute(container) {
  return {
    method: "GET",
    url: "/games/:id/dashboard",
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
      const game = await container.gameService.fetchByIdOrSlug(req.params?.["id"]);
      if (!game) return reply.status(404).send("game not found");

      const authorizationToken = String(req.headers.authorization);

      const isAdmin = game.private_token === authorizationToken;

      const authorizedPlayer = await container.playerService.fetchByPrivateToken(authorizationToken);

      /**
       *
       * @param {import("@killer-game/types").PlayerRecord} player
       */
      function canDisplayPlayer(player) {
        if (game.finished_at) return true;
        if (isAdmin) return true;
        if (player.id === authorizedPlayer?.id) return true;
        if (player.killed_by === authorizedPlayer?.id) return true;
        return false;
      }

      const players = await container.playerService.fetchPlayers(game.id);

      /** @type {import("@killer-game/types").GameDashboard} */
      const gameStatus = { podium: [], events: [] };

      for (const player of players) {
        const kills = await container.playerService.fetchPlayersKilled(player.id);
        gameStatus.podium.push({
          player: canDisplayPlayer(player) ? player : container.playerService.anonymize(player),
          kills: kills.map((p) => (canDisplayPlayer(p) ? p : container.playerService.anonymize(p))),
        });
      }

      gameStatus.podium.sort((a, b) => {
        const res = b.kills.length - a.kills.length;
        if (res !== 0) return res;

        return a.player.killed_at ? 1 : -1;
      });

      // events

      /**
       * @param {string} actionId
       * @returns {import("@killer-game/types").GameActionRecord}
       */
      function findAction(actionId) {
        // @ts-ignore
        return actions.find(({ id }) => id === actionId);
      }

      /**
       * @param {string | null} playerId
       * @returns {import("@killer-game/types").GameActionRecord}
       */
      function findPlayer(playerId) {
        const player = players.find(({ id }) => id === playerId);

        // @ts-ignore
        return canDisplayPlayer(player) ? player : container.playerService.anonymize(player);
      }

      const actions = await container.gameActionsService.all(game.id);
      // @ts-ignore
      gameStatus.events = players
        .filter((p) => p.killed_by)
        .map((target) => ({
          action: findAction(target.action_id),
          target: canDisplayPlayer(target) ? target : container.playerService.anonymize(target),
          player: findPlayer(target.killed_by),
          at: target.killed_at,
        }))
        .sort((a, b) => new Date(String(b.at)).getTime() - new Date(String(a.at)).getTime());

      return { data: gameStatus };
    },
  };
}
