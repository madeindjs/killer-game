import "../model.js";

import { generateSmallUuid } from "../utils/uuid.js";
import { getDb } from "./db.js";

export class PlayerService {
  /**
   * @type {import('knex').Knex}
   */
  #db;

  constructor(db = getDb()) {
    this.#db = db;
  }

  /**
   *
   * @param {string} field
   * @param {string | number} value
   * @returns {Promise<Player>}
   */
  fetchBy(field, value) {
    return this.#db
      .table("players")
      .where({ [field]: value })
      .first();
  }

  /**
   * @param {string} publicToken
   */
  fetchByPublicToken = (publicToken) => this.fetchBy("public_token", publicToken);

  /**
   *
   * @param {number} gameId
   * @returns {Promise<Player[]>}
   */
  fetchPayersByGameId(gameId) {
    return this.#db.table("players").where({ game_id: gameId });
  }

  /**
   * @param {Pick<Player, 'name' | 'game_id'>} player
   * @returns {Promise<Player>}
   */
  async create(player) {
    /** @type {Omit<Player, 'id'>} */
    const newGame = { public_token: generateSmallUuid(), ...player };

    const [{ id }] = await this.#db.table("players").insert(newGame).returning("id");

    return { ...newGame, id };
  }
}
