import type { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import type { GamePresence } from "@killer-game/types";
import type { Container } from "../services/container.js";
import { SubscriberEventNames } from "../services/subscriber.js";

interface GamesSseParams {
  id: string;
}

interface GamesSseQuery {
  player_id?: string;
  token?: string;
}

export function getGamesSSeRoute(container: Container): RouteOptions {
  return {
    method: "GET",
    url: "/games/:id/sse",
    schema: {
      tags: ["Games"],
      description:
        "Server-Sent Events stream for real-time game updates (game created, updated, deleted, player events). " +
        "Players can authenticate with `player_id` and `token` query parameters to be marked as connected: " +
        "a `PlayerPresence` event with the connected player ids is sent on subscription and on every change.",
      summary: "Subscribe to Game Events",
      params: {
        type: "object",
        properties: {
          id: { type: "string", description: "Game ID or slug" },
        },
        required: ["id"],
      },
      querystring: {
        type: "object",
        properties: {
          player_id: { type: "string", description: "ID of the player opening the stream (presence tracking)" },
          token: { type: "string", description: "Private token of the player (presence tracking)" },
        },
      },
      response: {
        200: { type: "string", format: "binary", description: "text/event-stream of JSON events" },
        404: { type: "object", properties: { error: { type: "string" } } },
      },
    },
    handler: async (req: FastifyRequest, reply: FastifyReply) => {
      const params = req.params as GamesSseParams;
      const query = req.query as GamesSseQuery;

      const game = await container.gameService.fetchByIdOrSlug(params.id);
      if (!game) return reply.status(404).send("game not found");

      const presence = container.presenceService;
      const getPresence = (): GamePresence => ({ connected_player_ids: presence.getConnectedPlayerIds(game.id) });
      const emitPresence = () => container.subscriber.emit(game.id, SubscriberEventNames.PlayerPresence, getPresence());

      const playerId = await authenticatePlayer(container, game.id, query);

      const subscription = (gameId: string, event: string, payload: unknown) => {
        if (String(game.id) !== String(gameId)) return;
        req.log.debug("send event");
        reply.sse({ data: JSON.stringify({ event, payload }) });
      };

      reply.sse({ event: "connected" });

      req.log.info(`Start SSE on ${game.id}`);

      container.subscriber.add(subscription);

      // send the current presence to the new subscriber, then notify everyone
      // else if a player just came online
      const cameOnline = playerId !== undefined && presence.connect(game.id, playerId);
      if (cameOnline) {
        emitPresence();
      } else {
        subscription(game.id, SubscriberEventNames.PlayerPresence, getPresence());
      }

      req.socket.on("close", () => {
        container.subscriber.delete(subscription);
        if (playerId !== undefined && presence.disconnect(game.id, playerId)) emitPresence();
      });
    },
  };
}

/** @returns the player id if the query identifies a player of this game */
async function authenticatePlayer(
  container: Container,
  gameId: string,
  query: GamesSseQuery,
): Promise<string | undefined> {
  if (!query.player_id || !query.token) return undefined;

  const player = await container.playerService.fetchById(query.player_id);
  if (!player || player.game_id !== gameId || player.private_token !== query.token) return undefined;

  return player.id;
}
