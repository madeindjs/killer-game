import assert from "node:assert";
import { after, before, describe, it } from "node:test";
import type Stripe from "stripe";
import { useServer, type UseServerReturn } from "../server.ts";
import { getStripeWebhookRoute } from "./stripe-webhook.ts";
import type { GameRecord, PaymentRecord } from "@killer-game/types";

describe(getStripeWebhookRoute.name, () => {
  let server: UseServerReturn;
  let game: GameRecord;

  before(async () => {
    server = await useServer("test");
    await server.container.db.migrate.latest();
    game = await server.container.gameService.create({ name: "webhook route" });

    // Stub the Stripe client so handleWebhookEvent can verify a signature.
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
    process.env.STRIPE_PRICE_ID = "price_test_webhook";

    const stub = {
      checkout: {
        sessions: {
          async create() {
            return { id: "cs_webhook_test", url: "https://example.com", amount_total: 999 };
          },
        },
      },
      webhooks: {
        constructEvent(rawBody: Buffer, signature: string): Stripe.Event {
          if (signature === "bad-signature") throw new Error("Invalid signature");
          const payload = JSON.parse(rawBody.toString()) as { type?: string; session_id?: string; game_id?: string };
          return {
            id: "evt_test",
            type: payload.type ?? "checkout.session.completed",
            data: {
              object: {
                id: payload.session_id ?? "cs_webhook_test",
                amount_total: 999,
                metadata: { game_id: payload.game_id ?? game.id },
                client_reference_id: payload.game_id ?? game.id,
              },
            },
          } as unknown as Stripe.Event;
        },
      },
    };
    server.container.paymentService.setStripeForTesting(stub as unknown as Stripe);

    // Seed a pending payment so the webhook has something to complete.
    await server.container.paymentService.createCheckoutSession({
      gameId: game.id,
      gameName: game.name,
    });
  });

  after(async () => {
    await server.close();
    delete process.env.STRIPE_WEBHOOK_SECRET;
    delete process.env.STRIPE_PRICE_ID;
  });

  it("returns 400 when the stripe-signature header is missing", async () => {
    const res = await server.server.inject({
      method: "POST",
      url: "/stripe/webhook",
      headers: { "content-type": "application/json" },
      payload: JSON.stringify({ type: "checkout.session.completed" }),
    });
    assert.strictEqual(res.statusCode, 400);
  });

  it("returns 400 when the signature is invalid", async () => {
    const res = await server.server.inject({
      method: "POST",
      url: "/stripe/webhook",
      headers: { "content-type": "application/json", "stripe-signature": "bad-signature" },
      payload: JSON.stringify({ type: "checkout.session.completed" }),
    });
    assert.strictEqual(res.statusCode, 400);
  });

  it("flips game.premium to true on a valid checkout.session.completed event", async () => {
    const before = await server.container.gameService.fetchByIdOrSlug(game.id);
    assert.strictEqual(before?.premium, false);

    const payment = await server.container.paymentService.fetchLatestByGameId(game.id);
    assert.ok(payment, "seed payment exists");
    const payload = JSON.stringify({
      type: "checkout.session.completed",
      session_id: (payment as PaymentRecord).stripe_session_id,
      game_id: game.id,
    });

    const res = await server.server.inject({
      method: "POST",
      url: "/stripe/webhook",
      headers: { "content-type": "application/json", "stripe-signature": "valid-signature" },
      payload,
    });
    assert.strictEqual(res.statusCode, 200, res.payload);

    const after = await server.container.gameService.fetchByIdOrSlug(game.id);
    assert.strictEqual(after?.premium, true);

    const completed = await server.container.paymentService.fetchLatestByGameId(game.id);
    assert.ok(completed);
    assert.strictEqual((completed as PaymentRecord).status, "completed");
  });
});