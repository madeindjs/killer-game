import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";

import { getMockDB } from "../test/db.mock.js";
import { mockLogger } from "../test/logger.mock.js";
import { GameService } from "./games.js";
import { PaymentService } from "./payments.ts";
import { Subscriber, SubscriberEventNames } from "./subscriber.js";

/**
 * Build a minimal Stripe-shaped stub. Only the methods used by
 * PaymentService are implemented; the rest throw so we notice if we
 * accidentally exercise them.
 */
function createStripeStub() {
  const createdSessions = [];
  return {
    createdSessions,
    checkout: {
      sessions: {
        async create(params) {
          const session = {
            id: `cs_test_${createdSessions.length + 1}`,
            url: `https://checkout.stripe.com/c/pay/cs_test_${createdSessions.length + 1}`,
            amount_total: params.line_items?.[0]?.price ? 999 : 0,
          };
          createdSessions.push({ params, session });
          return session;
        },
      },
    },
    webhooks: {
      constructEvent(rawBody, signature, secret) {
        if (signature === "bad-signature") {
          const error = new Error("Invalid signature");
          // Stripe SDK throws a StripeSignatureVerificationError
          throw error;
        }
        assert.ok(Buffer.isBuffer(rawBody) || typeof rawBody === "string", "raw body passed as Buffer");
        const payload = JSON.parse(rawBody.toString());
        return {
          id: "evt_test",
          type: payload.type ?? "checkout.session.completed",
          data: {
            object: {
              id: payload.session_id ?? "cs_test_1",
              amount_total: 999,
              metadata: { game_id: payload.game_id },
              client_reference_id: payload.game_id,
            },
          },
        };
      },
    },
  };
}

describe("PaymentService", () => {
  /** @type {import('knex').Knex} */
  let db;
  let subscriber;
  let gameService;
  let paymentService;
  let stripe;

  beforeEach(async () => {
    db = await getMockDB();
    subscriber = new Subscriber(mockLogger);
    gameService = new GameService(db, subscriber);
    stripe = createStripeStub();
    paymentService = new PaymentService(db, subscriber, mockLogger, /** @type {any} */ (stripe));
    process.env.STRIPE_PRICE_ID = "price_test_1";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  });

  afterEach(async () => {
    await db.destroy();
    delete process.env.STRIPE_PRICE_ID;
    delete process.env.STRIPE_WEBHOOK_SECRET;
  });

  describe("createCheckoutSession", () => {
    it("creates a pending payment and returns the Stripe checkout URL", async () => {
      const game = await gameService.create({ name: "premium test" });
      const result = await paymentService.createCheckoutSession({
        gameId: game.id,
        gameName: game.name,
        origin: "https://example.com",
      });

      assert.ok(result.checkout_url.startsWith("https://checkout.stripe.com/"));
      assert.ok(result.session_id.startsWith("cs_test_"));

      const payment = await paymentService.fetchLatestByGameId(game.id);
      assert.ok(payment, "payment row inserted");
      assert.strictEqual(payment.status, "pending");
      assert.strictEqual(payment.stripe_session_id, result.session_id);
      assert.strictEqual(payment.amount_cents, 999);

      const unchanged = await gameService.fetchByIdOrSlug(game.id);
      assert.strictEqual(unchanged.premium, false);
    });

    it("passes the organizer email as customer_email when provided", async () => {
      const game = await gameService.create({
        name: "premium email",
        organizer_email: "organizer@example.com",
      });
      await paymentService.createCheckoutSession({
        gameId: game.id,
        gameName: game.name,
        organizerEmail: game.organizer_email,
      });

      assert.strictEqual(stripe.createdSessions.length, 1);
      assert.strictEqual(
        stripe.createdSessions[0].params.customer_email,
        "organizer@example.com",
      );
    });

    it("throws when STRIPE_PRICE_ID is not configured", async () => {
      delete process.env.STRIPE_PRICE_ID;
      const game = await gameService.create({ name: "no price" });
      await assert.rejects(
        () => paymentService.createCheckoutSession({ gameId: game.id, gameName: game.name }),
        /STRIPE_PRICE_ID/,
      );
    });
  });

  describe("handleWebhookEvent", () => {
    it("flips game.premium to true and marks the payment completed", async () => {
      const game = await gameService.create({ name: "webhook test" });
      await paymentService.createCheckoutSession({
        gameId: game.id,
        gameName: game.name,
      });
      const payment = await paymentService.fetchLatestByGameId(game.id);

      const payload = JSON.stringify({
        type: "checkout.session.completed",
        session_id: payment.stripe_session_id,
        game_id: game.id,
      });

      const result = await paymentService.handleWebhookEvent(payload, "valid-signature");
      assert.deepStrictEqual(result, { received: true, gameId: game.id, premium: true });

      const updated = await gameService.fetchByIdOrSlug(game.id);
      assert.strictEqual(updated.premium, true);

      const completed = await paymentService.fetchLatestByGameId(game.id);
      assert.strictEqual(completed.status, "completed");
    });

    it("is idempotent: replaying a completed session is a no-op", async () => {
      const game = await gameService.create({ name: "idempotent" });
      await paymentService.createCheckoutSession({ gameId: game.id, gameName: game.name });
      const payment = await paymentService.fetchLatestByGameId(game.id);

      const payload = JSON.stringify({
        type: "checkout.session.completed",
        session_id: payment.stripe_session_id,
        game_id: game.id,
      });

      await paymentService.handleWebhookEvent(payload, "valid-signature");
      const result = await paymentService.handleWebhookEvent(payload, "valid-signature");
      assert.deepStrictEqual(result, { received: true, gameId: game.id, premium: true });

      const updated = await gameService.fetchByIdOrSlug(game.id);
      assert.strictEqual(updated.premium, true);
    });

    it("ignores non-checkout.session.completed events", async () => {
      const game = await gameService.create({ name: "other event" });
      await paymentService.createCheckoutSession({ gameId: game.id, gameName: game.name });

      const payload = JSON.stringify({
        type: "payment_intent.payment_failed",
        session_id: "cs_test_1",
        game_id: game.id,
      });

      const result = await paymentService.handleWebhookEvent(payload, "valid-signature");
      assert.deepStrictEqual(result, { received: true });

      const unchanged = await gameService.fetchByIdOrSlug(game.id);
      assert.strictEqual(unchanged.premium, false);
    });

    it("throws on invalid signature", async () => {
      const game = await gameService.create({ name: "bad sig" });
      const payload = JSON.stringify({
        type: "checkout.session.completed",
        session_id: "cs_test_1",
        game_id: game.id,
      });
      await assert.rejects(
        () => paymentService.handleWebhookEvent(payload, "bad-signature"),
        /Invalid signature/,
      );
      const unchanged = await gameService.fetchByIdOrSlug(game.id);
      assert.strictEqual(unchanged.premium, false);
    });

    it("emits a GameUpdated subscriber event after flipping premium", async () => {
      const game = await gameService.create({ name: "subscriber" });
      await paymentService.createCheckoutSession({ gameId: game.id, gameName: game.name });
      const payment = await paymentService.fetchLatestByGameId(game.id);

      let emitted = null;
      subscriber.add((_gameId, event, payload) => {
        if (event === SubscriberEventNames.GameUpdated) emitted = payload;
      });

      const payload = JSON.stringify({
        type: "checkout.session.completed",
        session_id: payment.stripe_session_id,
        game_id: game.id,
      });
      await paymentService.handleWebhookEvent(payload, "valid-signature");

      assert.ok(emitted, "GameUpdated event emitted");
      assert.strictEqual(emitted.id, game.id);
    });
  });
});