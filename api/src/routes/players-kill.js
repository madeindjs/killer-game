import { Container } from "../services/container.js";
import { ntfyGameFinished } from "../utils/ntfy.js";
import { PlayerKillResponse } from "../schemas.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getPlayersKillRoute(container) {
  return {
    method: "POST",
    url: "/players/:id/kill",
    schema: {
      tags: ["Players"],
      description: "Kill a player by providing the correct kill token. This marks the target as eliminated.",
      summary: "Kill Player",
      params: {
        type: "object",
        properties: {
          id: { type: "string", description: "Target player ID" },
        },
        required: ["id"],
      },
      body: {
        type: "object",
        properties: {
          kill_token: { type: "number", description: "The kill token assigned to the target player" },
        },
        required: ["kill_token"],
      },
      response: PlayerKillResponse,
    },
    handler: async (req, reply) => {
      const target = await container.playerService.fetchById(req.params?.["id"]);
      if (!target) return reply.status(404).send({ error: "target not found" });
      if (target.killed_at) return reply.status(400).send({ error: "the target is already dead" });

      const killToken = req.body?.["kill_token"];
      if (!killToken || target.kill_token !== killToken) return reply.status(400).send({ error: "bad kill token" });

      const game = await container.gameService.fetchByIdOrSlug(target.game_id);
      if (game.finished_at) return reply.status(400).send({ error: "the game is finished" });

      const player = await container.playerService.getPreviousPlayerAlive(target);
      if (!player) return reply.status(400).send({ error: "cannot find the previous player alive" });

      const now = new Date().toISOString();
      await container.playerService.update({ ...target, killed_at: now, killed_by: player.id });

      const players = await container.playerService.fetchPlayers(target.game_id);

      const isGameFinished = players.filter((p) => p.killed_by).length + 1 === players.length;
      if (isGameFinished) {
        await container.gameService.update({ ...game, finished_at: now });
        ntfyGameFinished(game, players);
      }

      return { success: true };
    },
  };
}
