import Fastify from "fastify";
import { FastifySSEPlugin } from "fastify-sse-v2";
import { getGamesRoutes } from "./routes/games.js";
import { getPlayerRoutes } from "./routes/players.js";
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

  /**
   * @param {import('fastify').RouteOptions} route
   */
  function mountRoute(route) {
    fastify.log.info(`Mounting route ${route.method} ${route.url}`);
    fastify.route(route);
  }

  [...Object.values(getGamesRoutes(container)), ...Object.values(getPlayerRoutes(container))].forEach(mountRoute);

  // Run the server!
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
