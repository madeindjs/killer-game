import { generateUuid } from "../utils/uuid.js";
import { Subscriber, SubscriberEventNames } from "./subscriber.js";

export class GameService {
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
   * @param {string} field
   * @param {string | number} value
   * @returns {Promise<GameRecord>}
   */
  fetchBy(field, value, fields = "*") {
    return this.#db
      .table("games")
      .select(fields)
      .where({ [field]: value })
      .first();
  }

  /**
   * @param {string} id
   */
  fetchById = (id, fields = "*") => this.fetchBy("id", id, fields);

  /**
   * @param {string} privateToken
   */
  fetchByPrivateToken = (privateToken, fields = "*") => this.fetchBy("private_token", privateToken, fields);

  /**
   * @param {Pick<GameRecord, 'name'>} game
   * @returns {Promise<GameRecord>}
   */
  async create(game) {
    /** @type {GameRecord} */
    const newGame = {
      id: generateUuid(),
      private_token: generateUuid(),
      name: game.name,
    };

    const [record] = await this.#db.table("games").insert(newGame).returning("*");

    this.#subscriber.emit(record.id, SubscriberEventNames.GameCreated, record);

    return record;
  }

  /**
   * @param {GameRecord} game
   * @returns {Promise<GameRecord>}
   */
  async update(game) {
    const updates = await this.#db
      .table("games")
      .update({ name: game.name })
      .where({ id: game.id })
      .limit(1)
      .returning("*");

    return updates[0];
  }

  /**
   * @param {GameRecord} game
   */
  async remove(game) {
    return this.#db.table("games").delete().where({ id: game.id });
  }
}
