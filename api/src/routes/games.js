import { Container } from "../services/container.js";

/**
 * @param {Container} container
 */
export function getGamesRoutes(container) {
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
      const gameRecord = await container.gameService.create({
        name: req.body?.["name"],
        actions: req.body?.["actions"],
      });

      return container.gameService.formatRecord(gameRecord);
    },
  };

  /**
   * @type {import('fastify').RouteOptions}
   */
  const updateByPrivateToken = {
    method: "PUT",
    url: "/games/by-private-token/:privateToken",
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
    handler: async (req, reply) => {
      const game = await container.gameService.fetchByPrivateToken(req.params?.["privateToken"]);
      if (!game) return reply.status(404).send("game not found");

      ["name"].filter((field) => req.body?.[field]).forEach((field) => (game[field] = req.body?.[field]));

      if (req.body?.["name"]) game.name = req.body?.["name"];
      if (req.body?.["actions"]) game.actions = req.body?.["name"];

      const gameRecord = await container.gameService.update(game);

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

      return container.gameService.formatRecord(game);
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

      return container.gameService.formatRecordForPublic(game);
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

  return { create, getByPrivateToken, getByPublicToken, listenByPublicToken, updateByPrivateToken };
}
