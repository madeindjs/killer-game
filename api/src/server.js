import Fastify from "fastify";
import { FastifySSEPlugin } from "fastify-sse-v2";
import { gamesRoutes } from "./routes/games.js";
import { playersRoutes } from "./routes/players.js";

export async function startServer() {
  const envToLogger = {
    development: {
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

  /**
   * @param {import('fastify').RouteOptions} route
   */
  function mountRoute(route) {
    fastify.log.info(`Mounting route ${route.method} ${route.url}`);
    fastify.route(route);
  }

  // Declare a route
  fastify.get("/", async function handler(request, reply) {
    return { hello: "world" };
  });

  [...Object.values(gamesRoutes), ...Object.values(playersRoutes)].forEach(mountRoute);

  // Run the server!
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
