import { randomUUID } from "node:crypto";
import type { FastifyRequest, FastifyReply, RouteOptions } from "fastify";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import type { Container } from "../services/container.js";
import { createMcpServer } from "./server.ts";

export function getMcpRoute(container: Container, version: string): RouteOptions {
  const sessions = new Map<string, StreamableHTTPServerTransport>();

  return {
    method: ["GET", "POST", "DELETE"],
    url: "/mcp",
    handler: async (req: FastifyRequest, reply: FastifyReply) => {
      const method = req.method;
      const sessionId = typeof req.headers["mcp-session-id"] === "string" ? req.headers["mcp-session-id"] : undefined;

      reply.hijack();

      // The underlying @hono/node-server transport schedules a socket drain that
      // calls destroySoon() on a mocked socket. Fastify's inject() uses a mock socket
      // without that method, so we patch it safely here for the request lifetime.
      const mockSocket = (req.raw as { socket?: { destroySoon?: () => void; destroyed: boolean } }).socket;
      if (mockSocket && !mockSocket.destroySoon) {
        mockSocket.destroySoon = function () {
          if (!this.destroyed) {
            this.destroyed = true;
          }
        };
      }

      if (method === "POST") {
        if (sessionId) {
          const transport = sessions.get(sessionId);
          if (!transport) {
            reply.raw.statusCode = 404;
            reply.raw.end(
              JSON.stringify({
                jsonrpc: "2.0",
                error: { code: -32_001, message: "Session not found" },
                id: null,
              }),
            );
            return;
          }
          await transport.handleRequest(req.raw, reply.raw, req.body);
          return;
        }

        if (isInitializeRequest(req.body)) {
          const mcpServer = createMcpServer(container, version);
          const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
          });

          transport.onclose = () => {
            if (transport.sessionId) sessions.delete(transport.sessionId);
            mcpServer.close().catch(() => {});
          };

          await mcpServer.connect(transport);
          await transport.handleRequest(req.raw, reply.raw, req.body);

          if (transport.sessionId) {
            sessions.set(transport.sessionId, transport);
          }
          return;
        }

        reply.raw.statusCode = 400;
        reply.raw.end(
          JSON.stringify({
            jsonrpc: "2.0",
            error: { code: -32_000, message: "Bad Request: initialize first" },
            id: null,
          }),
        );
        return;
      }

      // GET or DELETE: require an existing session
      const transport = sessionId ? sessions.get(sessionId) : undefined;
      if (!transport) {
        reply.raw.statusCode = 404;
        reply.raw.end(
          JSON.stringify({
            jsonrpc: "2.0",
            error: { code: -32_001, message: "Session not found" },
            id: null,
          }),
        );
        return;
      }

      await transport.handleRequest(req.raw, reply.raw, req.body);
    },
  };
}
