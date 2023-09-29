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
   * @returns {Promise<Game>}
   */
  fetchBy(field, value) {
    return getDb()
      .table("games")
      .where({ [field]: value })
      .first();
  }

  /**
   * @param {number} id
   */
  fetchById = (id) => this.fetchBy("id", id);

  /**
   * @param {string} privateToken
   */
  fetchByPrivateToken = (privateToken) => this.fetchBy("private_token", privateToken);

  /**
   * @param {string} publicToken
   */
  fetchByPublicToken = (publicToken) => this.fetchBy("public_token", publicToken);

  /**
   * @param {Pick<Game, 'name'>} game
   * @returns {Promise<Game>}
   */
  async createGame(game) {
    /** @type {Omit<Game, 'id'>} */
    const newGame = { private_token: generateUuid(), public_token: generateSmallUuid(), ...game };

    const [{ id }] = await this.#db.table("games").insert(newGame).returning("id");

    return { ...newGame, id };
  }
}
