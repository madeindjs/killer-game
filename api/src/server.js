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
} from "./routes/index.js";
import { Container } from "./services/container.js";

export function useServer(env = process.env.NODE_ENV) {
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

  const fastify = Fastify({ logger: envToLogger[env] });

  fastify.register(FastifySSEPlugin);

  // @ts-ignore
  const container = new Container(fastify.log, env);

  [
    getAdminGameShowRoute,
    getAdminGameUpdateRoute,
    getGamePlayersCreateRoute,
    getGamePlayersIndexRoute,
    getGamesCreateRoute,
    getGamesSSeRoute,
    getAdminGamePlayersRemoveRoute,
    getAdminGameRemoveRoute,
  ].forEach((routeBuilder) => {
    const route = routeBuilder(container);
    fastify.log.info(`Mounting route ${route.url} (${route.method})`);
    fastify.route(route);
  });

  return {
    server: fastify,
    container,
    close: async () => {
      fastify.close();
      await container.db.destroy();
    },
  };
}

export async function startServer(env = process.env.NODE_ENV) {
  const { server } = useServer(env);

  // Run the server!
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}
