import slugify from "slugify";
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import { generateUuid } from "../utils/uuid.js";
import { Subscriber, SubscriberEventNames } from "./subscriber.js";

export class GameService {
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
   * SQLite stores booleans as 0/1 integers. Coerce `premium` to a real boolean
   * so downstream code (serialization, tests, the frontend) sees a consistent type.
   * @param {any} game
   * @returns {any}
   */
  #normalizePremium(game) {
    if (game && "premium" in game) game.premium = Boolean(game.premium);
    return game;
  }

  /**
   * @param {string} field
   * @param {string | number} value
   * @returns {Promise<import('@killer-game/types').GameRecord>}
   */
  fetchBy(field, value, fields = "*") {
    return this.#db
      .table("games")
      .select(fields)
      .where({ [field]: value })
      .first()
      .then((game) => this.#normalizePremium(game));
  }

  /**
   * @param {string} idOrSlug
   */
  async fetchByIdOrSlug(idOrSlug, fields = "*") {
    const game = await this.fetchBy("id", idOrSlug, fields);
    if (game) return game;
    return this.fetchBy("slug", idOrSlug, fields);
  }

  async countTotalGames() {
    const count = await this.#db("games").count().first();
    return Number(count?.["count(*)"]);
  }

  async countTotalGamesStarted() {
    const count = await this.#db("games").whereNotNull("started_at").count().first();
    return Number(count?.["count(*)"]);
  }

  async countTotalGamesFinished() {
    const count = await this.#db("games").whereNotNull("finished_at").count().first();
    return Number(count?.["count(*)"]);
  }

  /**
   * @param {string} privateToken
   */
  fetchByPrivateToken = (privateToken, fields = "*") =>
    this.fetchBy("private_token", privateToken, fields);

  /**
   * @param {Pick<import('@killer-game/types').GameRecord, 'name' | 'organizer_email'>} game
   * @returns {Promise<import('@killer-game/types').GameRecord>}
   */
  async create(game) {
    /** @type {import('@killer-game/types').GameRecord} */
    const newGame = {
      id: generateUuid(),
      private_token: generateUuid(),
      name: game.name,
      slug: await this.#generateNewSlug(game.name),
      organizer_email: game.organizer_email,
    };

    const [record] = await this.#db.table("games").insert(newGame).returning("*");

    this.#subscriber.emit(record.id, SubscriberEventNames.GameCreated, this.sanitize(record));

    return this.#normalizePremium(record);
  }

  async #generateNewSlug(name) {
    const slug = slugify(name);
    const gamesWithSlugCount = await this.#db.table("games").where({ slug }).count().first();

    if (gamesWithSlugCount?.["count(*)"]) {
      return uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], separator: "-" });
    }

    return slug;
  }

  /**
   * @param {import('@killer-game/types').GameRecord} game
   * @returns {Promise<import('@killer-game/types').GameRecord>}
   */
  async update(game) {
    const updates = await this.#db
      .table("games")
      .update({ name: game.name, started_at: game.started_at, finished_at: game.finished_at })
      .where({ id: game.id })
      .limit(1)
      .returning("*");

    this.#subscriber.emit(game.id, SubscriberEventNames.GameUpdated, this.sanitize(updates[0]));

    return this.#normalizePremium(updates[0]);
  }

  /**
   * @param {import('@killer-game/types').GameRecord} game
   */
  async remove(game) {
    await this.#db.table("games").delete().where({ id: game.id });
    this.#subscriber.emit(game.id, SubscriberEventNames.GameDeleted, this.sanitize(game));
  }

  async getResume(gameId) {
    const players = await this.#db("players").where({ game_id: gameId });
  }

  /**
   * Remove private fields
   * @param {import("@killer-game/types").GameRecord} game
   * @returns {import("@killer-game/types").GameRecordSanitized}
   */
  sanitize(game) {
    return {
      id: game.id,
      name: game.name,
      slug: game.slug,
      started_at: game.started_at,
      finished_at: game.finished_at,
      organizer_email: game.organizer_email,
      premium: Boolean(game.premium),
    };
  }
}
