import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getPlayersKillRoute(container) {
  return {
    method: "POST",
    url: "/players/:id/kill",
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
        required: ["Authorization"],
      },
    },
    handler: async (req, reply) => {
      const player = await container.playerService.fetchById(req.params?.["id"]);
      if (!player) return reply.status(404).send("player not found");

      const isAdmin = player.private_token === String(req.headers.authorization);
      if (!isAdmin) return reply.status(403).send("You cannot access this endpoint");

      const targetId = req.body?.["target_id"];
      if (!targetId) return reply.status(400).send();

      const target = await container.playerService.fetchById(targetId);
      if (!target) return reply.status(400).send("target not found");
      if (target.killed_at) return reply.status(400).send("the target is already dead");

      const killToken = req.body?.["kill_token"];
      if (!killToken || target.kill_token !== killToken) return reply.status(400).send("bad kill token");

      await container.playerService.update({ ...target, killed_at: new Date().toISOString() });

      return { success: true };
    },
  };
}
