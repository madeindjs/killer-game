import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getGamesSSeRoute(container) {
  return {
    method: "GET",
    url: "/games/:id/sse",
    schema: {
      tags: ["Games"],
      description: "Server-Sent Events stream for real-time game updates (game created, updated, deleted, player events).",
      summary: "Subscribe to Game Events",
      params: {
        type: "object",
        properties: {
          id: { type: "string", description: "Game ID or slug" },
        },
        required: ["id"],
      },
      response: {
        200: { type: "string", format: "binary", description: "text/event-stream of JSON events" },
        404: { type: "object", properties: { error: { type: "string" } } },
      },
    },
    handler: async (req, reply) => {
      const game = await container.gameService.fetchByIdOrSlug(req.params?.["id"]);
      if (!game) return reply.status(404).send("game not found");

      /** @type {import("../services/subscriber.js").SubscriberHandler} */
      function subscription(gameId, event, payload) {
        if (String(game.id) !== String(gameId)) return;
        req.log.debug("send event");
        reply.sse({ data: JSON.stringify({ event, payload }) });
      }

      reply.sse({ event: "connected" });

      req.log.info(`Start SSE on ${game.id}`);

      container.subscriber.add(subscription);
      req.socket.on("close", () => container.subscriber.delete(subscription));
    },
  };
}
