import type { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import type { PlayerStatus } from "@killer-game/types";
import type { Container } from "../services/container.js";
import { PlayerStatusResponse } from "../schemas.js";

interface PlayersStatusParams {
  id: string;
}

export function getPlayersStatusRoute(container: Container): RouteOptions {
  return {
    method: "GET",
    url: "/players/:id/status",
    schema: {
      tags: ["Players"],
      description:
        "Get the authenticated player's current target and kill history. The target stays hidden until the game is started.",
      summary: "Get Player Status",
      params: {
        type: "object",
        properties: {
          id: { type: "string", description: "Player ID" },
        },
        required: ["id"],
      },
      headers: {
        type: "object",
        properties: {
          Authorization: { type: "string", description: "Player private token" },
        },
        required: ["Authorization"],
      },
      response: PlayerStatusResponse,
    },
    handler: async (req: FastifyRequest, reply: FastifyReply) => {
      const params = req.params as PlayersStatusParams;
      const player = await container.playerService.fetchById(params.id);
      if (!player) return reply.status(404).send("player not found");

      const isAdmin = player.private_token === String(req.headers.authorization);
      if (!isAdmin) return reply.status(403).send("You cannot access this endpoint");

      const playersKilled = await container.playerService.fetchPlayersKilled(player.id);

      const kills: PlayerStatus["kills"] = playersKilled.map((p) => ({
        player: container.playerService.sanitize(p),
        action: p.action,
      }));

      const game = await container.gameService.fetchByIdOrSlug(player.game_id);

      // Players wait in the lobby until the organizer starts the game: the
      // chain may still change (new players, shuffle), so don't reveal it.
      if (!game?.started_at) {
        const response: PlayerStatus = { current: {}, kills };
        return { data: response };
      }

      const target = await container.playerService.getCurrentTarget(player);

      const response: PlayerStatus = {
        current: {
          player: target ? container.playerService.sanitize(target) : undefined,
          action: target?.action,
        },
        kills,
      };

      return { data: response };
    },
  };
}
