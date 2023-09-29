import { Container } from "../services/container.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getGamesSSeRoute(container) {
  return {
    method: "GET",
    url: "/games/:publicToken/sse",
    schema: {},
    handler: async (req, reply) => {
      const game = await container.gameService.fetchByPublicToken(req.params?.["publicToken"]);
      if (!game) return reply.status(404).send("game not found");

      /** @type {import("../services/subscriber.js").SubscriberHandler} */
      function subscription(gameId, event, payload) {
        if (Number(game.id) !== Number(gameId)) return;
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