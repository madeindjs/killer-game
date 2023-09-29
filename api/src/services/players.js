import "../model.js";

import { generateSmallUuid } from "../utils/uuid.js";
import { Subscriber, SubscriberEventNames } from "./subscriber.js";

export class PlayerService {
  /**
   * @type {import('knex').Knex}
   */
  #db;
  /**
   * @type {Subscriber}
   */
  #subscriber;

  /**
   * @param {import('knex').Knex} db
   * @param {Subscriber} subscriber
   */
  constructor(db, subscriber) {
    this.#db = db;
    this.#subscriber = subscriber;
  }

  /**
   *
   * @param {string} field
   * @param {string | number} value
   * @returns {Promise<PlayerRecord>}
   */
  fetchBy(field, value, fields = "*") {
    return this.#db
      .table("players")
      .select(fields)
      .where({ [field]: value })
      .first();
  }

  /**
   * @param {string} publicToken
   */
  fetchByPublicToken = (publicToken, fields = "*") => this.fetchBy("public_token", publicToken, fields);

  /**
   *
   * @param {number} gameId
   * @returns {Promise<PlayerRecord[]>}
   */
  fetchPayersByGameId(gameId, fields = "*") {
    return this.#db.table("players").select(fields).where({ game_id: gameId });
  }

  /**
   * @param {Pick<PlayerRecord, 'name' | 'game_id'>} player
   * @returns {Promise<PlayerRecord>}
   */
  async create(player) {
    /** @type {Omit<PlayerRecord, 'id'>} */
    const newGame = { public_token: generateSmallUuid(), ...player };

    const [record] = await this.#db.table("players").insert(newGame).returning("*");

    this.#subscriber.emit(SubscriberEventNames.PlayerCreated, record);

    return record;
  }
}
