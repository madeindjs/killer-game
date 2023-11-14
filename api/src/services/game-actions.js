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
    const existingActions = await this.all(gameId, "id");
    const existingActionsIds = new Set(existingActions.map((r) => r.id));

    const res = await this.#db.transaction(async (trx) => {
      // const gameActionsTable = trx.table("game_actions");
      // const playersTable = trx.table("players");

      for (const action of actions) {
        // @ts-ignore
        const actionId = action.id;

        //  just update the name
        if (actionId) {
          await trx.table("game_actions").update({ name: action.name }).where({ id: actionId });
          existingActionsIds.delete(actionId);
          continue;
        }

        const existingAction = await trx
          .table("game_actions")
          .where({ name: action.name, game_id: gameId })
          .select("id")
          .first();

        if (existingAction) {
          existingActionsIds.delete(existingAction.id);
          continue;
        }

        await trx.table("game_actions").insert({ name: action.name, game_id: gameId, id: generateUuid() });
      }

      // remove action not updated
      for (const id of existingActionsIds) {
        const playersToUpdate = await trx.table("players").where({ game_id: gameId, action_id: id });

        for (const player of playersToUpdate) {
          const nextAction = await this.getNextActions(gameId, id, trx);
          await trx.table("players").update({ action_id: nextAction }).where({ id: player.id, game_id: gameId });
        }

        // const all = await gameActionsTable.where({ game_id: gameId });
        // const players = await trx.table("players").where({ game_id: gameId });

        await trx.table("game_actions").delete().where({ id: id, game_id: gameId });
      }

      // return await gameActionsTable.where({ game_id: gameId });

      // await trx.commit();
      // return a;
    });

    // console.log(res);

    return this.all(gameId);
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
   * @param {string} [notId]
   * @param {import('knex').Knex.Transaction} [trx]
   * @returns {Promise<string>}
   */
  async getNextActions(gameId, notId = undefined, trx = undefined) {
    const query = this.#db
      .table("game_actions")
      .select("game_actions.id", this.#db.raw("count(players.id) as count"))
      .leftJoin("players", "players.action_id", "game_actions.id")
      .where({ "game_actions.game_id": gameId })
      .groupBy("game_actions.id")
      .orderBy("count", "asc")
      .first();

    if (notId) query.whereNot("game_actions.id", "=", notId);

    if (trx) query.transacting(trx);

    const results = await query;

    return results?.id;
  }
}
