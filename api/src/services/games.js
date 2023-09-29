import { generateSmallUuid, generateUuid } from "../utils/uuid.js";
import { getDb } from "./db.js";

export class GameService {
  /**
   * @type {import('knex').Knex}
   */
  #db;

  constructor(db = getDb()) {
    this.#db = db;
  }

  /**
   * @param {string} field
   * @param {string | number} value
   * @returns {Promise<GameRecord>}
   */
  fetchBy(field, value, fields = "*") {
    return getDb()
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
  async createGame(game) {
    /** @type {Omit<GameRecord, 'id'>} */
    const newGame = {
      private_token: generateUuid(),
      public_token: generateSmallUuid(),
      ...game,
      actions: JSON.stringify(game.actions),
    };

    const [record] = await this.#db.table("games").insert(newGame).returning("*");

    return record;
  }

  /**
   * @param {GameRecord} game
   * @returns {Game}
   */
  formatRecord(game) {
    return { ...game, actions: JSON.parse(game.actions) };
  }
}
