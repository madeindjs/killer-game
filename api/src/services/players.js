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
   * @param {string | string[]} fields
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

    this.#subscriber.emit(player.game_id, SubscriberEventNames.PlayerCreated, this.sanitize(record));

    return record;
  }

  /**
   * @param {import('@killer-game/types').PlayerRecord} player
   * @returns {Promise<import('@killer-game/types').PlayerRecord>}
   */
  async update(player) {
    const [record] = await this.#db
      .table("players")
      .update({
        name: player.name,
        action_id: player.action_id,
        // TODO: compute when changed
        order: player.order,
        avatar:
          typeof player.avatar === "object" && player.avatar !== null ? JSON.stringify(player.avatar) : player.avatar,
      })
      .where({ id: player.id })
      .returning("*");

    this.#subscriber.emit(player.game_id, SubscriberEventNames.PlayerUpdated, this.sanitize(record));

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

    this.#subscriber.emit(player.game_id, SubscriberEventNames.PlayerDeleted, this.sanitize(player));
  }

  /**
   * @param {import('@killer-game/types').PlayerRecord} player
   * @returns {Promise<import("@killer-game/types").PlayerRecord>}
   */
  async getCurrentTarget(player) {
    const nextTarget = await this.#db
      .table("players")
      .where("order", ">", player.order)
      .andWhere("game_id", player.game_id)
      .andWhere("killed_at", null)
      .andWhereNot("id", player.id)
      .orderBy("order", "asc")
      .first();

    if (nextTarget) return nextTarget;

    return await this.#db
      .table("players")
      .andWhere("game_id", player.game_id)
      .andWhereNot("id", player.id)
      .orderBy("order", "asc")
      .first();
  }

  /**
   * Remove private fields
   * @param {import("@killer-game/types").PlayerRecord} player
   * @returns {import("@killer-game/types").PlayerRecordSanitized}
   */
  sanitize(player) {
    return {
      id: player.id,
      name: player.name,
      game_id: player.game_id,
      avatar: player.avatar,
    };
  }
}
