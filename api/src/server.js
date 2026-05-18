import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import Fastify from "fastify";
import { FastifySSEPlugin } from "fastify-sse-v2";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

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

  const fastify = Fastify({
    logger: envToLogger[env],
    bodyLimit: 5 * 1024 * 1024, // 5MB for file uploads
  });

  // Register Swagger for API documentation
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "Killer Game API",
        description: "API for managing Killer Game parties - Create games, manage players, and track eliminations",
        version: "4.4.0",
      },
      servers: [
        { url: "http://localhost:3001", description: "Development server" },
        { url: "https://api.killer-game.example.com", description: "Production server" },
      ],
      tags: [
        { name: "Games", description: "Game management endpoints" },
        { name: "Players", description: "Player management endpoints" },
        { name: "Stats", description: "Application statistics" },
      ],
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    initOAuth: {},
  });

  fastify.register(FastifySSEPlugin);
  await fastify.register(multipart, { 
    attachFieldsToBody: true,
    bodyLimit: 5 * 1024 * 1024, // 5MB
  });
  await fastify.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
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
