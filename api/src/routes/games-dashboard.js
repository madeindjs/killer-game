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

      const isAdmin = game.private_token === String(req.headers.authorization);
      if (!isAdmin) return reply.status(403).send("You cannot access this endpoint");

      const actions = await container.gameActionsService.all(game.id);
      const players = await container.playerService.fetchPlayers(game.id);

      /** @type {import("@killer-game/types").GameDashboard} */
      const gameStatus = { podium: [] };

      for (const player of players) {
        gameStatus.podium.push({
          player,
          kills: await container.playerService.fetchPlayersKilled(player.id),
        });
      }

      gameStatus.podium.sort((a, b) => {
        const res = b.kills.length - a.kills.length;
        if (res !== 0) return res;

        return a.player.killed_at ? 1 : -1;
      });

      return { data: gameStatus };
    },
  };
}
