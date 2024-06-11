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
    return this.#db.table("players").select(fields).where({ game_id: gameId }).orderBy("order");
  }

  /**
   * @param {string} gameId
   * @returns {Promise<import('@killer-game/types').PlayerRecord[]>}
   */
  fetchPlayers(gameId) {
    return this.#db("players").where({ game_id: gameId });
  }

  /**
   * @param {string} playerId
   * @returns {Promise<import('@killer-game/types').PlayerRecord[]>}
   */
  fetchPlayersKilled(playerId) {
    return this.#db("players").where({ killed_by: playerId });
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
      kill_token: Math.floor(Math.random() * 90) + 10,
      killed_at: null,
      killed_by: null,
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
    const currentPlayer = await this.fetchById(player.id);

    if (currentPlayer.order === player.order) return this.#update(player);

    const playerOrderSwap = await this.#db
      .table("players")
      .where({ game_id: player.game_id, order: player.order })
      .first();

    if (!playerOrderSwap) return this.#update(player);

    await this.#update({ ...playerOrderSwap, order: currentPlayer.order });
    return await this.#update(player);
  }

  /**
   * @param {import('@killer-game/types').PlayerRecord} player
   * @returns {Promise<import('@killer-game/types').PlayerRecord>}
   */
  async #update(player) {
    const [record] = await this.#db
      .table("players")
      .update({
        name: player.name,
        action_id: player.action_id,
        order: player.order,
        killed_at: player.killed_at,
        killed_by: player.killed_by,
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
   * @param {import("@killer-game/types").PlayerRecord} player
   * @returns {Promise<import("@killer-game/types").PlayerRecord>}
   */
  async getNextPlayer(player) {
    const nextPlayer = await this.#db
      .table("players")
      .where("order", "=", player.order + 1)
      .andWhere("game_id", player.game_id)
      .first();

    if (nextPlayer) return nextPlayer;

    return await this.#db.table("players").where("order", "=", 0).andWhere("game_id", player.game_id).first();
  }

  /**
   * @param {import("@killer-game/types").PlayerRecord} player
   * @returns {Promise<import("@killer-game/types").PlayerRecord>}
   */
  async getPreviousPlayer(player) {
    const prevPlayer = await this.#db
      .table("players")
      .where("order", "=", player.order - 1)
      .andWhere("game_id", player.game_id)
      .first();

    if (prevPlayer) return prevPlayer;

    return await this.#db.table("players").andWhere("game_id", player.game_id).orderBy("order", "desc").first();
  }

  /**
   * @param {import("@killer-game/types").PlayerRecord} player
   * @returns {Promise<import("@killer-game/types").PlayerRecord | undefined>}
   */
  async getPreviousPlayerAlive(player, idsBlacklist = []) {
    const prevPlayer = await this.getPreviousPlayer(player);
    if (prevPlayer === undefined) return undefined;
    if (idsBlacklist.includes(idsBlacklist)) return undefined;

    if (prevPlayer.killed_at) return this.getPreviousPlayerAlive(prevPlayer, [...idsBlacklist, prevPlayer.id]);
    return prevPlayer;
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

  async countTotalPlayersKilled() {
    const count = await this.#db("players").whereNotNull("killed_at").count().first();
    return Number(count?.["count(*)"]);
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

  /**
   * Remove private fields
   * @param {import("@killer-game/types").PlayerRecord} player
   * @returns {import("@killer-game/types").PlayerRecord}
   */
  anonymize(player) {
    return {
      id: "hidden",
      name: "hidden",
      action_id: "hidden",
      kill_token: -1,
      killed_at: player.killed_at,
      killed_by: "hidden",
      order: -1,
      private_token: "hidden",
      game_id: player.game_id,
      avatar: undefined,
    };
  }
}
