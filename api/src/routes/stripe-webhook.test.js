import assert from "node:assert";
import { after, before, describe, it } from "node:test";
import { useServer } from "../server.js";
import { getStripeWebhookRoute } from "./stripe-webhook.js";

describe(getStripeWebhookRoute.name, () => {
  /** @type {import("../server.js").UseServerReturn} */
  let server;
  /** @type {import('@killer-game/types').GameRecord} */
  let game;

  before(async () => {
    server = await useServer("test");
    await server.container.db.migrate.latest();
    game = await server.container.gameService.create({ name: "webhook route" });

    // Stub the Stripe client so handleWebhookEvent can verify a signature.
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
    process.env.STRIPE_PRICE_ID = "price_test_webhook";

    /** @type {any} */
    const stub = {
      checkout: {
        sessions: {
          async create() {
            return { id: "cs_webhook_test", url: "https://example.com", amount_total: 999 };
          },
        },
      },
      webhooks: {
        constructEvent(/** @type {Buffer} */ rawBody, /** @type {string} */ signature) {
          if (signature === "bad-signature") throw new Error("Invalid signature");
          const payload = JSON.parse(rawBody.toString());
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
          };
        },
      },
    };
    server.container.paymentService.setStripeForTesting(/** @type {any} */ (stub));

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
    assert.strictEqual(before.premium, false);

    const payment = await server.container.paymentService.fetchLatestByGameId(game.id);
    assert.ok(payment, "seed payment exists");
    const payload = JSON.stringify({
      type: "checkout.session.completed",
      session_id: payment.stripe_session_id,
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
    assert.strictEqual(after.premium, true);

    const completed = await server.container.paymentService.fetchLatestByGameId(game.id);
    assert.ok(completed);
    assert.strictEqual(completed.status, "completed");
  });
});