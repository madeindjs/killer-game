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
   * @returns {Promise<import('@killer-game/types').GameRecord>}
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
   * @param {Pick<import('@killer-game/types').GameRecord, 'name'>} game
   * @returns {Promise<import('@killer-game/types').GameRecord>}
   */
  async create(game) {
    /** @type {import('@killer-game/types').GameRecord} */
    const newGame = {
      id: generateUuid(),
      private_token: generateUuid(),
      name: game.name,
    };

    const [record] = await this.#db.table("games").insert(newGame).returning("*");

    this.#subscriber.emit(record.id, SubscriberEventNames.GameCreated, this.sanitize(record));

    return record;
  }

  /**
   * @param {import('@killer-game/types').GameRecord} game
   * @returns {Promise<import('@killer-game/types').GameRecord>}
   */
  async update(game) {
    const updates = await this.#db
      .table("games")
      .update({ name: game.name, started_at: game.started_at })
      .where({ id: game.id })
      .limit(1)
      .returning("*");

    this.#subscriber.emit(game.id, SubscriberEventNames.GameUpdated, this.sanitize(updates[0]));

    return updates[0];
  }

  /**
   * @param {import('@killer-game/types').GameRecord} game
   */
  async remove(game) {
    await this.#db.table("games").delete().where({ id: game.id });
    this.#subscriber.emit(game.id, SubscriberEventNames.GameDeleted, this.sanitize(game));
  }

  async getResume(gameId) {
    const players = await this.#db("players").where({ game_id: gameId });
  }

  /**
   * Remove private fields
   * @param {import("@killer-game/types").GameRecord} game
   * @returns {import("@killer-game/types").GameRecordSanitized}
   */
  sanitize(game) {
    return {
      id: game.id,
      name: game.name,
      started_at: game.started_at,
    };
  }
}
