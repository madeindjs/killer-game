import { generateSmallUuid, generateUuid } from "../utils/uuid.js";
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
   * @param {number} id
   */
  fetchById = (id, fields = "*") => this.fetchBy("id", id, fields);

  /**
   * @param {string} privateToken
   */
  fetchByPrivateToken = (privateToken, fields = "*") => this.fetchBy("private_token", privateToken, fields);

  /**
   * @param {string} publicToken
   */
  fetchByPublicToken = (publicToken, fields = "*") => this.fetchBy("public_token", publicToken, fields);

  /**
   * @param {{name: string, actions: string[]}} game
   * @returns {Promise<GameRecord>}
   */
  async create(game) {
    /** @type {Omit<GameRecord, 'id'>} */
    const newGame = {
      private_token: generateUuid(),
      public_token: generateSmallUuid(),
      ...game,
      actions: JSON.stringify(game.actions),
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
    return this.#db
      .table("games")
      .update({ ...game, actions: Array.isArray(game.actions) ? JSON.stringify(game.actions) : game.actions });
  }

  /**
   * @param {GameRecord} game
   * @returns {Game}
   */
  formatRecord(game) {
    return { ...game, actions: JSON.parse(game.actions) };
  }

  /**
   * @param {GameRecord} game
   * @returns {Omit<Game, 'private_token' | 'actions'>}
   */
  formatRecordForPublic(game) {
    const copy = { ...game };

    const privateFields = ["actions", "id", "private_token"];

    privateFields.forEach((field) => {
      delete copy[field];
    });

    return copy;
  }
}
