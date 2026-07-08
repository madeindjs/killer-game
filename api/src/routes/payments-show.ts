import type { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import type { Container } from "../services/container.js";
import { PaymentShowResponse } from "../schemas.js";

interface PaymentsShowParams {
  id: string;
}

export function getPaymentsShowRoute(container: Container): RouteOptions {
  return {
    method: "GET",
    url: "/games/:id/payments/latest",
    schema: {
      tags: ["Payments"],
      description: "Get the latest payment record for a game.",
      summary: "Get latest payment",
      params: {
        type: "object",
        properties: {
          id: { type: "string", description: "Game ID" },
        },
        required: ["id"],
      },
      response: PaymentShowResponse,
    },
    handler: async (req: FastifyRequest, reply: FastifyReply) => {
      const params = req.params as PaymentsShowParams;

      const payment = await container.paymentService.fetchLatestByGameId(params.id);
      if (!payment) return reply.status(404).send({ error: "no payment found for this game" });
      return { data: payment };
    },
  };
}