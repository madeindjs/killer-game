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
      const game = await container.gameService.fetchById(req.params?.["id"]);
      if (!game) return reply.status(404).send("game not found");

      // TODO: or game finished or allow from game params
      const isAdmin = game.private_token === String(req.headers.authorization);

      const players = await container.playerService.fetchPlayers(game.id);

      /** @type {import("@killer-game/types").GameDashboard} */
      const gameStatus = { podium: [], events: [] };

      for (const player of players) {
        const kills = await container.playerService.fetchPlayersKilled(player.id);
        gameStatus.podium.push({
          player: isAdmin ? player : container.playerService.anonymize(player),
          kills: isAdmin ? kills : kills.map(container.playerService.anonymize),
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
        return isAdmin ? player : container.playerService.anonymize(player);
      }

      const actions = await container.gameActionsService.all(game.id);
      // @ts-ignore
      gameStatus.events = players
        .filter((p) => p.killed_at)
        .map((target) => ({
          action: findAction(target.action_id),
          target,
          player: findPlayer(target.killed_by),
          at: target.killed_at,
        }))
        .sort((a, b) => new Date(String(b.at)).getTime() - new Date(String(a.at)).getTime());

      return { data: gameStatus };
    },
  };
}
