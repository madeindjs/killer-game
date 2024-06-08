import { Container } from "../services/container.js";
import { ntfyGameFinished } from "../utils/ntfy.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getPlayersKillNextRoute(container) {
  return {
    method: "POST",
    url: "/players/:id/kill-next",
    schema: {
      body: {
        type: "object",
        properties: {
          kill_token: { type: "number" },
          target_id: { type: "string" },
        },
        required: ["kill_token", "target_id"],
      },
      headers: {
        type: "object",
        properties: {
          Authorization: { type: "string" },
        },
      },
    },
    handler: async (req, reply) => {
      const player = await container.playerService.fetchById(req.params?.["id"]);
      if (!player) return reply.status(404).send({ error: "player not found" });

      const isAdmin = player.private_token === String(req.headers.authorization);
      if (!isAdmin) return reply.status(403).send({ error: "You cannot access this endpoint" });

      if (player.killed_at) return reply.status(400).send({ error: "Player cannot kill because he's dead" });

      const targetId = req.body?.["target_id"];
      if (!targetId) return reply.status(400).send();

      const target = await container.playerService.fetchById(targetId);
      if (!target) return reply.status(400).send({ error: "target not found" });
      if (target.killed_at) return reply.status(400).send({ error: "the target is already dead" });

      const killToken = req.body?.["kill_token"];
      if (!killToken || target.kill_token !== killToken) return reply.status(400).send({ error: "bad kill token" });

      const game = await container.gameService.fetchByIdOrSlug(player.game_id);
      if (game.finished_at) return reply.status(400).send({ error: "the game is finished" });

      const now = new Date().toISOString();

      await container.playerService.update({ ...target, killed_at: now, killed_by: player.id });

      const players = await container.playerService.fetchPlayers(player.game_id);

      const isGameFinished = players.filter((p) => p.killed_by).length + 1 === players.length;
      if (isGameFinished) {
        await container.gameService.update({ ...game, finished_at: now });
        ntfyGameFinished(game, players);
      }

      return { success: true };
    },
  };
}
