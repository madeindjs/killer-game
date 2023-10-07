import { SubscriberEventNames } from "@killer-game/types";
import { generateSmallUuid } from "../utils/uuid.js";
import { Subscriber } from "./subscriber.js";

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
   * @returns {Promise<import('@killer-game/types').PlayerRecord>}
   */
  fetchBy(field, value, fields = "*") {
    return this.#db
      .table("players")
      .select(fields)
      .where({ [field]: value })
      .first();
  }

  /**
   * @param {string} id
   */
  fetchById = (id, fields = "*") => this.fetchBy("id", id, fields);

  /**
   * @param {string} publicToken
   */
  fetchByPrivateToken = (publicToken, fields = "*") => this.fetchBy("private_token", publicToken, fields);

  /**
   * @param {string} gameId
   * @returns {Promise<import('@killer-game/types').PlayerRecord[]>}
   */
  fetchPayersByGameId(gameId, fields = "*") {
    return this.#db.table("players").select(fields).where({ game_id: gameId });
  }

  async fetchPlayers(gameId) {
    return this.#db("players").where({ game_id: gameId });
  }

  /**
   * @param {import('@killer-game/types').PlayerCreateDTO} player
   * @returns {Promise<import('@killer-game/types').PlayerRecord>}
   */
  async create(player) {
    /** @type {import('@killer-game/types').PlayerRecord} */
    const newPlayer = {
      id: generateSmallUuid(),
      private_token: generateSmallUuid(),
      order: await this.#findNextOrder(player.game_id),
      ...player,
    };

    const [record] = await this.#db.table("players").insert(newPlayer).returning("*");

    this.#subscriber.emit(player.game_id, SubscriberEventNames.PlayerCreated, record);

    return record;
  }

  /**
   * @param {string} gameId
   * @returns {Promise<number>}
   */
  async #findNextOrder(gameId) {
    const result = await this.#db("players")
      .where({ game_id: gameId })
      .select("order")
      .orderBy("order", "desc")
      .first();

    return result?.order === undefined ? 0 : result.order + 1;
  }

  /**
   * @param {import('@killer-game/types').PlayerRecord} player
   */
  async remove(player) {
    await this.#db.table("players").delete().where({ id: player.id });

    this.#subscriber.emit(player.game_id, SubscriberEventNames.PlayerDeleted, player);
  }
}
