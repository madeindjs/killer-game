import { Container } from "../services/container.js";
import sharp from "sharp";
import { AvatarUploadResponse } from "../schemas.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getPlayersAvatarUploadRoute(container) {
  return {
    method: "POST",
    url: "/players/:playerId/avatar-image",
    schema: {
      tags: ["Players"],
      description: "Upload a custom avatar image for a player. Resized to 300x300 WebP. Requires player or admin token.",
      summary: "Upload Avatar Image",
      params: {
        type: "object",
        properties: {
          playerId: { type: "string", description: "Player ID" },
        },
        required: ["playerId"],
      },
      response: AvatarUploadResponse,
    },
    handler: async (req, reply) => {
      try {
        /** @type {{playerId: string}} */
        // @ts-ignore
        const params = req.params;

        // Check player exists first
        const player = await container.playerService.fetchBy("id", params.playerId);
        if (!player) return reply.status(404).send({ error: "Player not found" });

        const game = await container.gameService.fetchBy("id", player.game_id, "private_token");
        if (!game) return reply.status(404).send({ error: "Game not found" });

        // Check authentication - player's own token or game's organizer token
        const authToken = String(req.headers.authorization || "");
        if (![player.private_token, game.private_token].includes(authToken)) {
          return reply.status(403).send({ error: "Invalid token" });
        }

      // Parse multipart form data - with attachFieldsToBody: true, file is in req.body.image
      const data = req.body.image;
      if (!data) {
        return reply.status(400).send({ error: "No image file provided" });
      }

      // Validate file type - mimetype might be in different properties
      const mimeType = data.mimetype || data.contentType || data.type;
      if (!mimeType || !mimeType.startsWith("image/")) {
        return reply.status(400).send({ error: "File must be an image" });
      }

      try {
        // Process image with sharp: resize to 300x300, center crop, convert to WebP
        // Note: with attachFieldsToBody, the buffer is in data._buf, not data.buffer
        const buffer = data._buf || data.buffer;
        const processedImage = await sharp(buffer)
          .resize(300, 300, {
            fit: "cover",
            position: "center",
          })
          .webp({ quality: 80 })
          .toBuffer();
        // Update player with the processed image
        const playerUpdated = await container.playerService.update({
          ...player,
          avatar_image: processedImage,
        });

        return { data: container.playerService.sanitize(playerUpdated) };
      } catch (error) {
        container.logger.error(error, "Failed to process image");
        return reply.status(400).send({ error: "Failed to process image" });
      }
      } catch (error) {
        container.logger.error(error, "Upload handler error");
        return reply.status(500).send({ error: error.message });
      }
    },
  };
}

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getPlayersAvatarDeleteRoute(container) {
  return {
    method: "DELETE",
    url: "/players/:playerId/avatar-image",
    schema: {
      tags: ["Players"],
      description: "Delete a player's custom uploaded avatar image. Requires player or admin token.",
      summary: "Delete Avatar Image",
      params: {
        type: "object",
        properties: {
          playerId: { type: "string", description: "Player ID" },
        },
        required: ["playerId"],
      },
      response: AvatarUploadResponse,
    },
    handler: async (req, reply) => {
      /** @type {{playerId: string}} */
      // @ts-ignore
      const params = req.params;

      const player = await container.playerService.fetchBy("id", params.playerId);
      if (!player) return reply.status(404).send({ error: "Player not found" });

      const game = await container.gameService.fetchBy("id", player.game_id, "private_token");
      if (!game) return reply.status(404).send({ error: "Game not found" });

      // Check authentication
      const authToken = String(req.headers.authorization);
      if (![player.private_token, game.private_token].includes(authToken)) {
        return reply.status(403).send({ error: "Invalid token" });
      }

      // Remove avatar_image by setting it to null
      const playerUpdated = await container.playerService.update({
        ...player,
        avatar_image: null,
      });

      return { data: container.playerService.sanitize(playerUpdated) };
    },
  };
}
