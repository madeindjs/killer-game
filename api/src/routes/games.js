import { GameService } from "../services/games.js";

/**
 *
 * ~~~sh
 * curl -X POST -H 'Content-Type: application/json' -d '{"name": "test"}' http://localhost:3000/games
 * ~~~
 *
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
      },
      required: ["name"],
    },
  },
  handler: (req) => {
    const gameServices = new GameService();

    return gameServices.createGame({ name: req.body?.["name"] });
  },
};

/**
 * ~~~sh
 * curl http://localhost:3000/games/by-private-token/cd000679-9f78-488e-a38c-ac6b4114fc67
 * ~~~
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
 * ~~~sh
 * curl http://localhost:3000/games/by-private-token/cd000679-9f78-488e-a38c-ac6b4114fc67
 * ~~~
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
