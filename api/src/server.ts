import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import Fastify from "fastify";
import { FastifySSEPlugin } from "fastify-sse-v2";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

import { getMcpRoute } from "./mcp/route.ts";
import { getStripeWebhookRoute } from "./routes/stripe-webhook.js";
import * as getRoutes from "./routes/index.js";
import * as schemas from "./schemas.js";
import { Container } from "./services/container.js";
import { ntfy } from "./utils/ntfy.js";
import { getBackendVersion } from "./utils/version.js";

export interface UseServerReturn {
  server: Fastify.FastifyInstance;
  container: Container;
  close: () => Promise<void>;
}

type NodeEnv = "development" | "production" | "test" | undefined;

export async function useServer(env: NodeEnv = process.env.NODE_ENV as NodeEnv): Promise<UseServerReturn> {
  const envToLogger: Record<string, Fastify.LoggerOptions | boolean> = {
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
    logger: envToLogger[env ?? "development"],
    bodyLimit: 5 * 1024 * 1024, // 5MB for file uploads
  });

  const version = await getBackendVersion();

  // Register Swagger for API documentation
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "Killer Game API",
        description:
          "API for managing Killer Game parties - Create games, manage players, and track eliminations",
        version,
      },
      servers: [
        { url: "http://localhost:3001", description: "Development server" },
        {
          url: "https://api.killer-game.example.com",
          description: "Production server",
        },
      ],
      tags: [
        { name: "Games", description: "Game management endpoints" },
        { name: "Players", description: "Player management endpoints" },
        { name: "Stats", description: "Application statistics" },
      ],
    },
    refResolver: {
      buildLocalReference(json) {
        return json.$id || json.title;
      },
    },
  });

  // Register reusable JSON schemas so response refs can be resolved by Fastify and Swagger.
  for (const schema of Object.values(schemas)) {
    if (schema.$id) fastify.addSchema(schema);
  }

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
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  fastify.setErrorHandler(async (error, request, reply) => {
    const message = `Error ${error.message} on ${request.url}`;
    fastify.log.error(error);
    await ntfy(`⚠️ ${message}`)?.catch(() => {});
    reply.status(error.statusCode ?? 500).send({ error: error.message });
  });

  const container = new Container(fastify.log, env);

  await container.db.migrate.up();

  Object.values(getRoutes).forEach((routeBuilder) => {
    const route = routeBuilder(container);
    fastify.log.info(`Mounting route ${route.url} (${route.method})`);
    fastify.route(route);
  });

  fastify.route(getMcpRoute(container, version));

  // Stripe webhook: register in an isolated plugin context with a raw-body
  // content-type parser so the signature can be verified against the exact
  // bytes Stripe sent. Fastify's default JSON parser would mutate the body.
  const stripeWebhookRoute = getStripeWebhookRoute(container);
  fastify.log.info(`Mounting route ${stripeWebhookRoute.url} (${stripeWebhookRoute.method})`);
  await fastify.register(async (scope) => {
    scope.decorateRequest("rawBody", null);
    scope.addContentTypeParser(
      "application/json",
      { parseAs: "buffer" },
      (_req, body, done) => {
        // The raw buffer is stored as `req.body` (Fastify's default body slot)
        // so the handler can forward it to `stripe.webhooks.constructEvent`.
        done(null, body);
      },
    );
    scope.route(stripeWebhookRoute);
  });

  return {
    server: fastify,
    container,
    close: async () => {
      await fastify.close();
      await container.db.destroy();
    },
  };
}

export async function startServer(env: NodeEnv = process.env.NODE_ENV as NodeEnv): Promise<void> {
  const { server, container } = await useServer(env);

  const { PORT = "3001" } = process.env;

  process.on("SIGINT", async () => {
    container.logger.info("SIGINT - Caught interrupt signal");

    await server.close();
    container.logger.info("SIGINT - Server closed");
    await container.db.destroy();
    container.logger.info("SIGINT - db closed");
  });

  try {
    await server.listen({ port: Number(PORT), host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}
