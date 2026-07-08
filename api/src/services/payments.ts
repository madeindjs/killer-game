import Stripe from "stripe";
import { generateUuid } from "../utils/uuid.js";
import { Subscriber, SubscriberEventNames } from "./subscriber.js";
import type { FastifyBaseLogger } from "fastify";
import type { Knex } from "knex";
import type { PaymentRecord, PaymentStatus, CheckoutSessionResponse } from "@killer-game/types";

const DEFAULT_SITE_URL = "https://the-killer.online";

export interface CreateCheckoutInput {
  gameId: string;
  gameName: string;
  organizerEmail?: string | null;
  origin?: string;
}

export interface WebhookResult {
  received: true;
  gameId?: string;
  premium?: boolean;
}

export class PaymentService {
  #db: Knex;
  #subscriber: Subscriber;
  #stripe: Stripe | undefined;
  #logger: FastifyBaseLogger;

  constructor(db: Knex, subscriber: Subscriber, logger: FastifyBaseLogger, stripe: Stripe | undefined = undefined) {
    this.#db = db;
    this.#subscriber = subscriber;
    this.#logger = logger;
    this.#stripe = stripe;
  }

  /** @internal Test-only seam to inject a Stripe stub. */
  setStripeForTesting(stripe: Stripe | undefined): void {
    this.#stripe = stripe;
  }

  #getStripe(): Stripe | undefined {
    if (this.#stripe) return this.#stripe;
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) return undefined;
    this.#stripe = new Stripe(secretKey);
    return this.#stripe;
  }

  async createCheckoutSession(input: CreateCheckoutInput): Promise<CheckoutSessionResponse & { payment: PaymentRecord }> {
    const stripe = this.#getStripe();
    if (!stripe) throw new Error("Stripe is not configured (STRIPE_SECRET_KEY missing)");

    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) throw new Error("Stripe is not configured (STRIPE_PRICE_ID missing)");

    const siteUrl = input.origin || process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
    const successUrl = `${siteUrl}/games/${input.gameId}?checkout=success`;
    const cancelUrl = `${siteUrl}/games/${input.gameId}?checkout=cancel`;

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: input.gameId,
      metadata: { game_id: input.gameId, game_name: input.gameName },
      ...(input.organizerEmail ? { customer_email: input.organizerEmail } : {}),
    };

    const session = await stripe.checkout.sessions.create(params);

    const [record] = await this.#db
      .table("payments")
      .insert({
        id: generateUuid(),
        game_id: input.gameId,
        stripe_session_id: session.id,
        amount_cents: session.amount_total ?? 0,
        status: "pending" as PaymentStatus,
      })
      .returning("*");

    return {
      checkout_url: session.url ?? "",
      session_id: session.id,
      payment: record,
    };
  }

  async fetchLatestByGameId(gameId: string): Promise<PaymentRecord | undefined> {
    return this.#db
      .table("payments")
      .select("*")
      .where({ game_id: gameId })
      .orderBy("created_at", "desc")
      .first();
  }

  async handleWebhookEvent(rawBody: string | Buffer, signature: string): Promise<WebhookResult> {
    const stripe = this.#getStripe();
    if (!stripe) throw new Error("Stripe is not configured (STRIPE_SECRET_KEY missing)");
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) throw new Error("Stripe is not configured (STRIPE_WEBHOOK_SECRET missing)");

    const event = stripe.webhooks.constructEvent(
      typeof rawBody === "string" ? Buffer.from(rawBody) : rawBody,
      signature,
      secret,
    );

    if (event.type !== "checkout.session.completed") {
      return { received: true };
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const gameId = session.metadata?.game_id || session.client_reference_id;
    if (!gameId) return { received: true };

    const existing = await this.#db
      .table("payments")
      .select("*")
      .where({ stripe_session_id: session.id, status: "completed" })
      .first();
    if (existing) return { received: true, gameId, premium: true };

    await this.#db
      .table("payments")
      .update({ status: "completed", amount_cents: session.amount_total ?? 0 })
      .where({ stripe_session_id: session.id });

    await this.#db.table("games").update({ premium: true }).where({ id: gameId });

    const game = await this.#db.table("games").select("*").where({ id: gameId }).first();
    if (game) this.#subscriber.emit(gameId, SubscriberEventNames.GameUpdated, game);

    return { received: true, gameId, premium: true };
  }
}