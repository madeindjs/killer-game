import { container } from "../services/container.js";

/**
 * @type {import('fastify').RouteOptions}
 */
const create = {
  method: "POST",
  url: "/games",
  schema: {
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
        actions: { type: "array" },
      },
      required: ["name"],
    },
  },
  handler: async (req) => {
    const gameRecord = await container.gameService.createGame({
      name: req.body?.["name"],
      actions: req.body?.["actions"],
    });

    return container.gameService.formatRecord(gameRecord);
  },
};

/**
 * @type {import('fastify').RouteOptions}
 */
const getByPrivateToken = {
  method: "GET",
  url: "/games/by-private-token/:privateToken",
  schema: {},
  handler: async (req, reply) => {
    const game = await container.gameService.fetchByPrivateToken(req.params?.["privateToken"]);
    if (!game) return reply.status(404).send("game not found");

    return game;
  },
};

/**
 * @type {import('fastify').RouteOptions}
 */
const getByPublicToken = {
  method: "GET",
  url: "/games/by-public-token/:publicToken",
  schema: {},
  handler: async (req, reply) => {
    const game = await container.gameService.fetchByPublicToken(req.params?.["publicToken"]);
    if (!game) return reply.status(404).send("game not found");

    return game;
  },
};

/**
 * @type {import('fastify').RouteOptions}
 */
const listenByPublicToken = {
  method: "GET",
  url: "/games/by-public-token/:publicToken/sse",
  schema: {},
  handler: async (req, reply) => {
    const game = await container.gameService.fetchByPublicToken(req.params?.["publicToken"]);
    if (!game) return reply.status(404).send("game not found");

    /** @type {import("../services/subscriber.js").SubscriberHandler} */
    function subscription(gameId, event, payload) {
      if (game.id !== gameId) return;
      req.log.debug("send event");
      reply.sse({ data: JSON.stringify({ event, payload }) });
    }

    container.subscriber.add(subscription);
    req.socket.on("close", () => container.subscriber.delete(subscription));
  },
};

export const gamesRoutes = { create, getByPrivateToken, getByPublicToken, listenByPublicToken };
