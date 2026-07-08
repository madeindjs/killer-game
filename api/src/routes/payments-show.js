import { Container } from "../services/container.js";
import { PaymentShowResponse } from "../schemas.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getPaymentsShowRoute(container) {
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
    handler: async (req, reply) => {
      /** @type {{id: string}} */
      // @ts-ignore
      const params = req.params;

      const payment = await container.paymentService.fetchLatestByGameId(params.id);
      if (!payment) return reply.status(404).send({ error: "no payment found for this game" });
      return { data: payment };
    },
  };
}