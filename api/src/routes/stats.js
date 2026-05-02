import { Container } from "../services/container.js";
import { getBackendVersion } from "../utils/version.js";

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
        games_created: await container.gameService.countTotalGames(),
        games_started: await container.gameService.countTotalGamesStarted(),
        games_finished: await container.gameService.countTotalGamesFinished(),
        players_eliminated: await container.playerService.countTotalPlayersKilled(),
        players_eliminated_last_6_months: await container.playerService.countPlayersEliminatedLast6Months(),
      };

      /** @type {import("@killer-game/types").ApplicationStats} */
      const data = { counts, version: await getBackendVersion() };

      return { data };
    },
  };
}
