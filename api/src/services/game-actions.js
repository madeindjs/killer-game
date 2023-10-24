import { generateUuid } from "../utils/uuid.js";
import { Subscriber } from "./subscriber.js";

export class GameActionsService {
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
   * @returns {Promise<import('@killer-game/types').GameActionRecord>}
   */
  fetchBy(field, value, fields = "*") {
    return this.#db
      .table("game_actions")
      .select(fields)
      .where({ [field]: value })
      .first();
  }

  /**
   * @param {string} id
   */
  fetchById = (id, fields = "*") => this.fetchBy("id", id, fields);

  /**
   * @param {string} gameId
   * @param {import("@killer-game/types").GameActionCreateDTO[]} actions
   * @returns {Promise<import("@killer-game/types").GameActionRecord[]>}
   */
  async create(gameId, actions) {
    if (actions.length === 0) return [];
    return this.#db
      .table("game_actions")
      .insert(actions.map((action) => ({ name: action.name, game_id: gameId, id: generateUuid() })))
      .returning("*");
  }

  /**
   * @param {string} gameId
   * @param {Array<import("@killer-game/types").GameActionCreateDTO | import("@killer-game/types").GameActionRecord>} actions
   * @returns
   */
  async update(gameId, actions) {
    const res = [];

    const existingActions = await this.all(gameId);
    const existingActionsIds = existingActions.map((a) => a.id);

    // @ts-ignore
    const actionsIds = actions.filter((a) => a?.id).map((a) => a.id);

    const actionIdsToRemove = existingActionsIds.filter((a) => !actionsIds.includes(a));
    // TODO: remove

    // @ts-ignore
    const namesToInsert = actions.filter((a) => !a?.id).map((a) => a.name);

    if (namesToInsert.length > 0) {
      const newActions = await this.#db
        .table("game_actions")
        .insert(namesToInsert.map((name) => ({ name, game_id: gameId, id: generateUuid() })))
        .returning("*");

      res.push(...newActions);
    }

    const newActions = [...res, ...existingActions];

    // this.#subscriber.emit(gameId, SubscriberEventNames.)

    return newActions;
  }

  /**
   * @param {string} gameId
   * @param {string | string[]} [fields]
   * @returns {Promise<import("@killer-game/types").GameActionRecord[]>}
   */
  all(gameId, fields = "*") {
    return this.#db.table("game_actions").select(fields).where({ game_id: gameId });
  }

  /**
   * @param {string} gameId
   * @returns {Promise<string>}
   */
  async getNextActions(gameId) {
    const results = await this.#db
      .table("game_actions")
      .select("game_actions.id", this.#db.raw("count(players.id) as count"))
      .leftJoin("players", "players.action_id", "game_actions.id")
      .where({ "game_actions.game_id": gameId })
      .groupBy("game_actions.id")
      .orderBy("count", "asc")
      .first();

    return results?.id;
  }
}
