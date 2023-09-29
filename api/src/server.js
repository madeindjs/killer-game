import Fastify from "fastify";
import { FastifySSEPlugin } from "fastify-sse-v2";
import {
  getAdminGamePlayersRemoveRoute,
  getAdminGameRemoveRoute,
  getAdminGameShowRoute,
  getAdminGameUpdateRoute,
  getGamePlayersCreateRoute,
  getGamePlayersIndexRoute,
  getGamesCreateRoute,
  getGamesSSeRoute,
  getGamesShowRoute,
} from "./routes/index.js";
import { Container } from "./services/container.js";

export async function startServer() {
  const envToLogger = {
    development: {
      level: "debug",
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    },
    production: true,
    test: false,
  };

  const fastify = Fastify({ logger: envToLogger.development });

  fastify.register(FastifySSEPlugin);

  const container = new Container(fastify.log);

  [
    getAdminGameShowRoute,
    getAdminGameUpdateRoute,
    getGamePlayersCreateRoute,
    getGamePlayersIndexRoute,
    getGamesCreateRoute,
    getGamesSSeRoute,
    getGamesShowRoute,
    getAdminGamePlayersRemoveRoute,
    getAdminGameRemoveRoute,
  ].forEach((routeBuilder) => {
    const route = routeBuilder(container);
    fastify.log.info(`Mounting route ${route.url} (${route.method})`);
    fastify.route(route);
  });

  // Run the server!
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
