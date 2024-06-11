import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getStatsRoute(container) {
  return {
    method: "GET",
    url: "/stats",
    handler: async (req, res) => {
      /** @type {import("@killer-game/types").ApplicationStats['counts']} */
      const counts = {
        games_started: await container.gameService.countTotalGamesStarted(),
        games_finished: await container.gameService.countTotalGamesFinished(),
        players_killed: await container.playerService.countTotalPlayersKilled(),
      };

      return { data: { counts } };
    },
  };
}
