import { getDb } from "./db.js";
import { GameService } from "./games.js";
import { PlayerService } from "./players.js";
import { Subscriber } from "./subscriber.js";

/**
 * help dependcy injection
 */
export class Container {
  /**
   * @type {import('knex').Knex}
   */
  #db;
  /**
   * @type {GameService}
   */
  #gameService;
  /**
   * @type {PlayerService}
   */
  #playerService;
  /**
   * @type {Subscriber}
   */
  #subscriber;

  constructor() {
    this.#db = getDb();
    this.#subscriber = new Subscriber();
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
}

export const container = new Container();
