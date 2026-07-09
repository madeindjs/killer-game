import type { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import type { Container } from "../services/container.js";
import { PaymentsCreateResponse } from "../schemas.js";

interface PaymentsCreateParams {
  id: string;
}

interface PaymentsCreateBody {
  origin?: string;
  success_url?: string;
  cancel_url?: string;
}

export function getPaymentsCreateRoute(container: Container): RouteOptions {
  return {
    method: "POST",
    url: "/games/:id/payments/checkout",
    schema: {
      tags: ["Payments"],
      description:
        "Create a Stripe Checkout session for a one-shot premium upgrade of a game. Requires the game admin token. Optional JSON body: { origin, success_url, cancel_url }.",
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
    handler: async (req: FastifyRequest, reply: FastifyReply) => {
      const params = req.params as PaymentsCreateParams;

      const game = await container.gameService.fetchByIdOrSlug(params.id);
      if (!game) return reply.status(404).send({ error: "game not found" });
      if (game.private_token !== String(req.headers.authorization)) {
        return reply.status(403).send({ error: "token invalid" });
      }

      if (game.premium) {
        return reply.status(400).send({ error: "game is already premium" });
      }

      const body = (req.body ?? {}) as PaymentsCreateBody;

      try {
        const result = await container.paymentService.createCheckoutSession({
          gameId: game.id,
          gameName: game.name,
          organizerEmail: game.organizer_email,
          origin: body.origin,
          successUrl: body.success_url,
          cancelUrl: body.cancel_url,
        });
        return { data: { checkout_url: result.checkout_url, session_id: result.session_id } };
      } catch (err) {
        container.logger.error(err, "Failed to create Stripe Checkout session");
        return reply.status(500).send({ error: err instanceof Error ? err.message : "stripe error" });
      }
    },
  };
}