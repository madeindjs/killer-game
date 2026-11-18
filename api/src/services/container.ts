import knex, { type Knex } from "knex";
import type { FastifyBaseLogger } from "fastify";
import configuration from "../../knexfile.js";
import { GameService } from "./games.ts";
import { PlayerService } from "./players.ts";
import { PaymentService } from "./payments.ts";
import { PresenceService } from "./presence.ts";
import { Subscriber } from "./subscriber.js";

export type ContainerEnv = "development" | "production" | "test";

/**
 * help dependcy injection
 */
export class Container {
  #db: Knex;
  #gameService: GameService;
  #playerService: PlayerService;
  #paymentService: PaymentService;
  #presenceService: PresenceService = new PresenceService();
  #subscriber: Subscriber;
  #logger: FastifyBaseLogger;

  constructor(logger: FastifyBaseLogger, env?: ContainerEnv) {
    this.#logger = logger;
    this.#db = knex({ ...configuration[env ?? "development"] });

    this.#db.on("query", (query: { sql: string; bindings: unknown }) => {
      this.#logger.debug(`[KNEX] ${query.sql} -- ${JSON.stringify(query.bindings)}`);
    });

    this.#subscriber = new Subscriber(this.#logger);
    this.#gameService = new GameService(this.#db, this.#subscriber);
    this.#playerService = new PlayerService(this.#db, this.#subscriber);
    this.#paymentService = new PaymentService(this.#db, this.#subscriber, this.#logger);
  }

  get db(): Knex {
    return this.#db;
  }

  get playerService(): PlayerService {
    return this.#playerService;
  }

  get gameService(): GameService {
    return this.#gameService;
  }

  get paymentService(): PaymentService {
    return this.#paymentService;
  }

  get presenceService(): PresenceService {
    return this.#presenceService;
  }

  get subscriber(): Subscriber {
    return this.#subscriber;
  }

  get logger(): FastifyBaseLogger {
    return this.#logger;
  }
}
