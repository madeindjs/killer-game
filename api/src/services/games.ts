import type { Knex } from "knex";
import type { GameCreateDTO, GameRecord, GameRecordSanitized } from "@killer-game/types";
import slugify from "slugify";
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import { generateUuid } from "../utils/uuid.js";
import { Subscriber, SubscriberEventNames } from "./subscriber.js";

type Fields = string | string[];

export class GameService {
  #db: Knex;
  #subscriber: Subscriber;

  constructor(db: Knex, subscriber: Subscriber) {
    this.#db = db;
    this.#subscriber = subscriber;
  }

  /**
   * SQLite stores booleans as 0/1 integers. Coerce `premium` to a real boolean
   * so downstream code (serialization, tests, the frontend) sees a consistent type.
   */
  #normalizePremium<T>(game: T): T {
    if (game && typeof game === "object" && "premium" in game) {
      (game as { premium?: unknown }).premium = Boolean(game.premium);
    }
    return game;
  }

  fetchBy(field: string, value: string | number, fields: Fields = "*"): Promise<GameRecord> {
    return this.#db
      .table("games")
      .select(fields)
      .where({ [field]: value })
      .first()
      .then((game: GameRecord) => this.#normalizePremium(game));
  }

  async fetchByIdOrSlug(idOrSlug: string, fields: Fields = "*"): Promise<GameRecord> {
    const game = await this.fetchBy("id", idOrSlug, fields);
    if (game) return game;
    return this.fetchBy("slug", idOrSlug, fields);
  }

  async countTotalGames(): Promise<number> {
    const count = await this.#db("games").count().first();
    return Number(count?.["count(*)"]);
  }

  async countTotalGamesStarted(): Promise<number> {
    const count = await this.#db("games").whereNotNull("started_at").count().first();
    return Number(count?.["count(*)"]);
  }

  async countTotalGamesFinished(): Promise<number> {
    const count = await this.#db("games").whereNotNull("finished_at").count().first();
    return Number(count?.["count(*)"]);
  }

  fetchByPrivateToken = (privateToken: string, fields: Fields = "*"): Promise<GameRecord> =>
    this.fetchBy("private_token", privateToken, fields);

  async create(game: GameCreateDTO): Promise<GameRecord> {
    const newGame: GameRecord = {
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

  async #generateNewSlug(name: string): Promise<string> {
    const slug = slugify(name);
    const gamesWithSlugCount = await this.#db.table("games").where({ slug }).count().first();

    if (gamesWithSlugCount?.["count(*)"]) {
      return uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], separator: "-" });
    }

    return slug;
  }

  async update(game: GameRecord): Promise<GameRecord> {
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
   * Delete a game and its players.
   *
   * SQLite does not enforce foreign keys unless `PRAGMA foreign_keys` is
   * enabled (it is not), so the `ON DELETE CASCADE` of `players.game_id` is a
   * no-op: delete the players explicitly instead of leaving orphans behind.
   */
  async remove(game: GameRecord): Promise<void> {
    await this.#db.transaction(async (trx) => {
      await trx.table("players").delete().where({ game_id: game.id });
      await trx.table("games").delete().where({ id: game.id });
    });
    this.#subscriber.emit(game.id, SubscriberEventNames.GameDeleted, this.sanitize(game));
  }

  /** Remove private fields */
  sanitize(game: GameRecord): GameRecordSanitized {
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
