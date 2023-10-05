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
   * @param {string} gameId
   * @param {string[]} actions
   * @returns
   */
  async update(gameId, actions) {
    const res = [];

    const existingActions = await this.all(gameId);

    const existingNames = existingActions.map((a) => a.name);

    const actionsToInsert = actions.filter((action) => !existingNames.includes(action));

    if (actionsToInsert.length > 0) {
      const newActions = await this.#db
        .table("game_actions")
        .insert(actionsToInsert.map((name) => ({ name, game_id: gameId, id: generateUuid() })))
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
   * @returns {Promise<GameActionRecord[]>}
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
      .orderBy("count", "asc");
    console.log(results);

    return results[0]?.id;
  }
}
