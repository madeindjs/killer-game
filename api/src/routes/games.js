import { GameService } from "../services/games.js";

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
    const gameServices = new GameService();

    const gameRecord = await gameServices.createGame({ name: req.body?.["name"], actions: req.body?.["actions"] });

    return gameServices.formatRecord(gameRecord);
  },
};

/**
 * @type {import('fastify').RouteOptions}
 */
const getByPrivateToken = {
  method: "GET",
  url: "/games/by-private-token/:privateToken",
  schema: {},
  handler: (req) => {
    const gameServices = new GameService();

    return gameServices.fetchByPrivateToken(req.params?.["privateToken"]);
  },
};

/**
 * @type {import('fastify').RouteOptions}
 */
const getByPublicToken = {
  method: "GET",
  url: "/games/by-public-token/:publicToken",
  schema: {},
  handler: (req) => {
    const gameServices = new GameService();

    return gameServices.fetchByPublicToken(req.params?.["publicToken"]);
  },
};

export const gamesRoutes = { create, getByPrivateToken, getByPublicToken };
