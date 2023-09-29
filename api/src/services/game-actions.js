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
   * @param {number} gameId
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
        .insert(actionsToInsert.map((name) => ({ name, game_id: gameId })))
        .returning("*");

      res.push(...newActions);
    }

    return [...res, ...existingActions];
  }

  /**
   * @param {number} gameId
   * @returns {Promise<GameActionRecord[]>}
   */
  all(gameId, fields = "*") {
    return this.#db.table("game_actions").where({ game_id: gameId });
  }
}
