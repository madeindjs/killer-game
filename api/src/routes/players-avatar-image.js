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
      tags: ["Players"],
      description: "Get a player's custom uploaded avatar image (300x300 WebP).",
      summary: "Get Avatar Image",
      params: {
        type: "object",
        properties: {
          playerId: { type: "string", description: "Player ID" },
        },
        required: ["playerId"],
      },
      response: {
        200: {
          type: "string",
          format: "binary",
          description: "Avatar image as WebP",
        },
        404: {
          type: "object",
          properties: {
            error: { type: "string", example: "Player or avatar image not found" },
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
