import cors from "@fastify/cors";
import Fastify from "fastify";
import { FastifySSEPlugin } from "fastify-sse-v2";

import * as getRoutes from "./routes/index.js";
import { Container } from "./services/container.js";
import { ntfy } from "./utils/ntfy.js";

/**
 * @typedef UseServerReturn
 * @property {import('fastify').FastifyInstance} server
 * @property {Container} container
 * @property {() => Promise<void>} close
 */

/**
 *
 * @param {string} [env]
 * @returns {Promise<UseServerReturn>}
 */
export async function useServer(env = process.env.NODE_ENV) {
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
  await fastify.register(cors, {
    // put your options here
  });

  fastify.setErrorHandler(async (error, request, reply) => {
    const message = `Error ${error.message} on ${request.url}`;
    fastify.log.error(error);
    await ntfy(`⚠️ ${message}`)?.catch(() => {});
    reply.status(error.statusCode ?? 500).send({ error: error.message });
  });

  // @ts-ignore
  const container = new Container(fastify.log, env);

  await container.db.migrate.up();

  Object.values(getRoutes).forEach((routeBuilder) => {
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
  const { server, container } = await useServer(env);

  const { PORT = "3001" } = process.env;

  process.on("SIGINT", async () => {
    container.logger.info("SIGINT - Caught interrupt signal");

    await server.close();
    container.logger.info("SIGINT - Server closed");
    await container.db.destroy();
    container.logger.info("SIGINT - db closed");
  });

  // Run the server!
  try {
    await server.listen({ port: Number(PORT), host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}
