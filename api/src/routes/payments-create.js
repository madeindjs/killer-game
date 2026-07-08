import { Container } from "../services/container.js";
import { PaymentsCreateResponse } from "../schemas.js";

/**
 * @param {Container} container
 * @returns {import('fastify').RouteOptions}
 */
export function getPaymentsCreateRoute(container) {
  return {
    method: "POST",
    url: "/games/:id/payments/checkout",
    schema: {
      tags: ["Payments"],
      description:
        "Create a Stripe Checkout session for a one-shot premium upgrade of a game. Requires the game admin token.",
      summary: "Create Stripe Checkout session",
      params: {
        type: "object",
        properties: {
          id: { type: "string", description: "Game ID" },
        },
        required: ["id"],
      },
      headers: {
        type: "object",
        properties: {
          Authorization: { type: "string", description: "Admin private token" },
        },
        required: ["Authorization"],
      },
      response: PaymentsCreateResponse,
    },
    handler: async (req, reply) => {
      /** @type {{id: string}} */
      // @ts-ignore
      const params = req.params;

      const game = await container.gameService.fetchByIdOrSlug(params.id);
      if (!game) return reply.status(404).send({ error: "game not found" });
      if (game.private_token !== String(req.headers.authorization)) {
        return reply.status(403).send({ error: "token invalid" });
      }

      if (game.premium) {
        return reply.status(400).send({ error: "game is already premium" });
      }

      /** @type {{origin?: string}} */
      // @ts-ignore
      const body = req.body ?? {};

      try {
        const result = await container.paymentService.createCheckoutSession({
          gameId: game.id,
          gameName: game.name,
          organizerEmail: game.organizer_email,
          origin: body.origin,
        });
        return { data: { checkout_url: result.checkout_url, session_id: result.session_id } };
      } catch (err) {
        container.logger.error(err, "Failed to create Stripe Checkout session");
        return reply.status(500).send({ error: err instanceof Error ? err.message : "stripe error" });
      }
    },
  };
}