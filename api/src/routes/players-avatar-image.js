import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getPlayersAvatarImageRoute(container) {
  return {
    method: "GET",
    url: "/players/:playerId/avatar-image",
    schema: {
      response: {
        200: {
          type: "string",
          format: "binary",
          additionalProperties: true,
        },
        404: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: async (req, reply) => {
      /** @type {{playerId: string}} */
      // @ts-ignore
      const params = req.params;

      const player = await container.playerService.fetchBy("id", params.playerId, "avatar_image");
      if (!player || !player.avatar_image) {
        return reply.status(404).send({ error: "Player or avatar image not found" });
      }

      return reply
        .header("Content-Type", "image/webp")
        .header("Cache-Control", "public, max-age=86400") // Cache 24h
        .send(player.avatar_image);
    },
  };
}
