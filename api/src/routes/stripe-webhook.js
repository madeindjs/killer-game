import { Container } from "../services/container.js";
import { StripeWebhookResponse } from "../schemas.js";

/** @typedef {import('fastify').RouteOptions} RouteOptions */

/**
 * Stripe webhook route. Registered in an isolated Fastify plugin context in
 * `server.ts` with a raw-buffer content-type parser, so `req.body` is the
 * exact Buffer Stripe sent — required by `stripe.webhooks.constructEvent`.
 *
 * @param {Container} container
 * @returns {RouteOptions}
 */
export function getStripeWebhookRoute(container) {
  return {
    method: "POST",
    url: "/stripe/webhook",
    schema: {
      tags: ["Payments"],
      description:
        "Stripe webhook endpoint for `checkout.session.completed` events. Verifies the Stripe signature, marks the matching payment as completed and flips the game's `premium` flag. The body is NOT parsed as JSON; the raw payload is forwarded to Stripe's signature verification.",
      summary: "Stripe webhook",
      response: StripeWebhookResponse,
    },
    handler: async (req, reply) => {
      /** @type {Buffer | null} */
      // @ts-ignore - set by the raw-buffer content-type parser in server.ts
      const rawBody = req.body;
      if (!rawBody || !Buffer.isBuffer(rawBody)) {
        return reply.status(400).send({ error: "empty or invalid body" });
      }

      const signature = String(req.headers["stripe-signature"] ?? "");
      if (!signature) return reply.status(400).send({ error: "missing stripe-signature header" });

      try {
        await container.paymentService.handleWebhookEvent(rawBody, signature);
        return { data: { status: "success" } };
      } catch (err) {
        container.logger.error(err, "Stripe webhook verification failed");
        return reply.status(400).send({ error: err instanceof Error ? err.message : "webhook verification failed" });
      }
    },
  };
}