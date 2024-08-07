import knex from "knex";
import configuration from "../../knexfile.js";
import { GameService } from "./games.js";
import { PlayerService } from "./players.js";
import { Subscriber } from "./subscriber.js";

/**
 * help dependcy injection
 */
export class Container {
  /** @type {import('knex').Knex} */
  #db;
  /** @type {GameService} */
  #gameService;
  /** @type {PlayerService} */
  #playerService;
  /** @type {Subscriber} */
  #subscriber;
  /** @type {import('fastify').FastifyBaseLogger} */
  #logger;

  /**
   * @param {import('fastify').FastifyBaseLogger} logger
   * @param {'development' | undefined} env
   */
  constructor(logger, env) {
    this.#logger = logger;
    this.#db = knex({ ...configuration[env ?? "development"] });

    this.#db.on("query", (query) => {
      this.#logger.debug(`[KNEX] ${query.sql} -- ${JSON.stringify(query.bindings)}`);
    });

    this.#subscriber = new Subscriber(this.#logger);
    this.#gameService = new GameService(this.#db, this.#subscriber);
    this.#playerService = new PlayerService(this.#db, this.#subscriber);
  }

  get db() {
    return this.#db;
  }

  get playerService() {
    return this.#playerService;
  }

  get gameService() {
    return this.#gameService;
  }

  get subscriber() {
    return this.#subscriber;
  }

  get logger() {
    return this.#logger;
  }
}
