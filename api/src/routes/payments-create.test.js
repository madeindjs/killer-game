import assert from "node:assert";
import { after, before, describe, it } from "node:test";
import { useServer } from "../server.js";
import { getPaymentsCreateRoute } from "./payments-create.js";

describe(getPaymentsCreateRoute.name, () => {
  /** @type {import("../server.js").UseServerReturn} */
  let server;
  /** @type {import('@killer-game/types').GameRecord} */
  let game;

  before(async () => {
    server = await useServer("test");
    await server.container.db.migrate.latest();
    game = await server.container.gameService.create({
      name: "checkout route",
      organizer_email: "organizer@example.com",
    });

    // Stub the Stripe client on the existing PaymentService so we don't hit the network.
    /** @type {any} */
    const stub = {
      checkout: {
        sessions: {
          async create(/** @type {any} */ params) {
            return {
              id: "cs_test_route_1",
              url: "https://checkout.stripe.com/c/pay/cs_test_route_1",
              amount_total: 999,
            };
          },
        },
      },
      webhooks: {
        constructEvent() {
          throw new Error("not used here");
        },
      },
    };
    // Replace the internal stripe instance on the service.
    server.container.paymentService.setStripeForTesting(/** @type {any} */ (stub));
    process.env.STRIPE_PRICE_ID = "price_test_route";
  });

  after(async () => {
    await server.close();
    delete process.env.STRIPE_PRICE_ID;
  });

  it("returns 404 for an unknown game", async () => {
    const res = await server.server.inject({
      method: "POST",
      url: "/games/does-not-exist/payments/checkout",
      headers: { authorization: game.private_token },
    });
    assert.strictEqual(res.statusCode, 404);
  });

  it("returns 400 without the admin token (schema validation)", async () => {
    const res = await server.server.inject({
      method: "POST",
      url: `/games/${game.id}/payments/checkout`,
    });
    assert.strictEqual(res.statusCode, 400);
  });

  it("returns 403 with the wrong admin token", async () => {
    const res = await server.server.inject({
      method: "POST",
      url: `/games/${game.id}/payments/checkout`,
      headers: { authorization: "wrong-token" },
    });
    assert.strictEqual(res.statusCode, 403);
  });

  it("creates a checkout session and returns the URL with the admin token", async () => {
    const res = await server.server.inject({
      method: "POST",
      url: `/games/${game.id}/payments/checkout`,
      headers: { authorization: game.private_token, "content-type": "application/json" },
      payload: JSON.stringify({ origin: "https://example.com" }),
    });
    assert.strictEqual(res.statusCode, 200, res.payload);
    const body = res.json();
    assert.strictEqual(body.data.checkout_url, "https://checkout.stripe.com/c/pay/cs_test_route_1");
    assert.strictEqual(body.data.session_id, "cs_test_route_1");

    const payment = await server.container.paymentService.fetchLatestByGameId(game.id);
    assert.ok(payment, "payment row inserted");
    assert.strictEqual(payment.status, "pending");
    assert.strictEqual(payment.stripe_session_id, "cs_test_route_1");
  });

  it("returns 400 when the game is already premium", async () => {
    await server.container.db.table("games").update({ premium: true }).where({ id: game.id });
    const res = await server.server.inject({
      method: "POST",
      url: `/games/${game.id}/payments/checkout`,
      headers: { authorization: game.private_token, "content-type": "application/json" },
    });
    assert.strictEqual(res.statusCode, 400);
  });
});