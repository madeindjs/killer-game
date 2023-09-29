import { GameService } from "../services/games.js";
import { PlayerService } from "../services/players.js";

/**
 * @type {import('fastify').RouteOptions}
 */
const createByGamePublicToken = {
  method: "POST",
  url: "/games/by-public-token/:publicToken/players",
  schema: {
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
      },
      required: ["name"],
    },
  },
  handler: async (req, res) => {
    const game = await new GameService().fetchByPublicToken(req.params?.["publicToken"]);

    if (!game) {
      return res.status(404).send("game not found");
    }

    return new PlayerService().create({ name: req.body?.["name"], game_id: game.id });
  },
};

/**
 * @type {import('fastify').RouteOptions}
 */
const getGamesPlayersByGamePublicToken = {
  method: "GET",
  url: "/games/by-public-token/:publicToken/players",
  handler: async (req, res) => {
    const game = await new GameService().fetchByPublicToken(req.params?.["publicToken"]);

    if (!game) {
      return res.status(404).send("game not found");
    }

    return new PlayerService().fetchPayersByGameId(game.id);
  },
};

export const playersRoutes = { createByGamePublicToken, getGamesPlayersByGamePublicToken };
