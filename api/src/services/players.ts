import type { Knex } from "knex";
import type { PlayerCreateDTO, PlayerRecord, PlayerRecordSanitized } from "@killer-game/types";
import { generateSmallUuid } from "../utils/uuid.js";
import { Subscriber, SubscriberEventNames } from "./subscriber.js";

/** Returns a float in `[0, 1)`, like `Math.random`. */
export type RandomGenerator = () => number;

export class PlayerService {
  #db: Knex;
  #subscriber: Subscriber;
  #random: RandomGenerator;

  constructor(db: Knex, subscriber: Subscriber, random: RandomGenerator = Math.random) {
    this.#db = db;
    this.#subscriber = subscriber;
    this.#random = random;
  }

  /** @internal Test-only seam to make the chain order deterministic. */
  setRandomForTesting(random: RandomGenerator): void {
    this.#random = random;
  }

  /** Random integer in `[0, max]` (inclusive). */
  #randomInt(max: number): number {
    return Math.min(max, Math.floor(this.#random() * (max + 1)));
  }

  fetchBy(field: string, value: string | number, fields: string | string[] = "*"): Promise<PlayerRecord> {
    return this.#db
      .table("players")
      .select(fields)
      .where({ [field]: value })
      .first();
  }

  fetchById = (id: string, fields: string | string[] = "*"): Promise<PlayerRecord> => this.fetchBy("id", id, fields);

  fetchByPrivateToken = (publicToken: string, fields: string | string[] = "*"): Promise<PlayerRecord> =>
    this.fetchBy("private_token", publicToken, fields);

  fetchPayersByGameId(gameId: string, fields: string | string[] = "*"): Promise<PlayerRecord[]> {
    return this.#db.table("players").select(fields).where({ game_id: gameId }).orderBy("name");
  }

  fetchPlayers(gameId: string): Promise<PlayerRecord[]> {
    return this.#db("players").where({ game_id: gameId });
  }

  fetchPlayersKilled(playerId: string): Promise<PlayerRecord[]> {
    return this.#db("players").where({ killed_by: playerId });
  }

  /**
   * Create a player and insert it at a random position in the chain, so a
   * player cannot guess their target from the join order.
   */
  async create(player: PlayerCreateDTO): Promise<PlayerRecord> {
    const record: PlayerRecord = await this.#db.transaction(async (trx) => {
      const order = await this.#reserveRandomOrder(trx, player.game_id);

      const newPlayer: PlayerRecord = {
        id: generateSmallUuid(),
        private_token: generateSmallUuid(),
        order,
        kill_token: Math.floor(Math.random() * 90) + 10,
        killed_at: null,
        killed_by: null,
        ...player,
      } as PlayerRecord;

      const [inserted] = await trx.table("players").insert(newPlayer).returning("*");
      return inserted;
    });

    this.#subscriber.emit(player.game_id, SubscriberEventNames.PlayerCreated, this.sanitize(record));

    return record;
  }

  /**
   * Pick a random slot in the chain (before any existing player, or at the end)
   * and shift the following players to free it.
   * @returns the order to give to the new player
   */
  async #reserveRandomOrder(trx: Knex.Transaction, gameId: string): Promise<number> {
    const rows: Pick<PlayerRecord, "order">[] = await trx("players")
      .where({ game_id: gameId })
      .select("order")
      .orderBy("order", "asc");
    const orders = rows.map((r) => r.order);

    const slot = this.#randomInt(orders.length);

    if (slot === orders.length) {
      return orders.length === 0 ? 0 : orders[orders.length - 1] + 1;
    }

    const order = orders[slot];
    await trx("players").where({ game_id: gameId }).andWhere("order", ">=", order).increment("order", 1);
    return order;
  }

  /**
   * Randomly re-assign the whole chain (Fisher-Yates). Orders are private, so
   * no event is emitted: admins have to refetch the players list.
   */
  async shuffleOrder(gameId: string): Promise<void> {
    await this.#db.transaction(async (trx) => {
      const players: Pick<PlayerRecord, "id">[] = await trx("players")
        .where({ game_id: gameId })
        .select("id")
        .orderBy("order", "asc");
      const ids = players.map((p) => p.id);

      for (let i = ids.length - 1; i > 0; i--) {
        const j = this.#randomInt(i);
        [ids[i], ids[j]] = [ids[j], ids[i]];
      }

      for (const [order, id] of ids.entries()) {
        await trx("players").where({ id }).update({ order });
      }
    });
  }

  async update(player: PlayerRecord): Promise<PlayerRecord> {
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

  async #update(player: PlayerRecord): Promise<PlayerRecord> {
    const updateData: Partial<PlayerRecord> = {
      name: player.name,
      action: player.action,
      order: player.order,
      killed_at: player.killed_at,
      killed_by: player.killed_by,
      avatar: typeof player.avatar === "object" && player.avatar !== null ? JSON.stringify(player.avatar) : player.avatar,
    };

    // Only include avatar_image if it's explicitly set (not undefined)
    if (player.avatar_image !== undefined) {
      updateData.avatar_image = player.avatar_image;
    }

    const [record] = await this.#db.table("players").update(updateData).where({ id: player.id }).returning("*");

    this.#subscriber.emit(player.game_id, SubscriberEventNames.PlayerUpdated, this.sanitize(record));

    return record;
  }

  async remove(player: PlayerRecord): Promise<void> {
    await this.#db.table("players").delete().where({ id: player.id });

    this.#subscriber.emit(player.game_id, SubscriberEventNames.PlayerDeleted, this.sanitize(player));
  }

  async getNextPlayer(player: PlayerRecord): Promise<PlayerRecord> {
    const nextPlayer = await this.#db
      .table("players")
      .where("order", "=", player.order + 1)
      .andWhere("game_id", player.game_id)
      .first();

    if (nextPlayer) return nextPlayer;

    return await this.#db.table("players").where("order", "=", 0).andWhere("game_id", player.game_id).first();
  }

  async getPreviousPlayer(player: PlayerRecord): Promise<PlayerRecord> {
    const prevPlayer = await this.#db
      .table("players")
      .where("order", "=", player.order - 1)
      .andWhere("game_id", player.game_id)
      .first();

    if (prevPlayer) return prevPlayer;

    return await this.#db.table("players").andWhere("game_id", player.game_id).orderBy("order", "desc").first();
  }

  async getPreviousPlayerAlive(player: PlayerRecord, idsBlacklist: string[] = []): Promise<PlayerRecord | undefined> {
    const prevPlayer = await this.getPreviousPlayer(player);
    if (prevPlayer === undefined) return undefined;
    if (idsBlacklist.includes(prevPlayer.id)) return undefined;

    if (prevPlayer.killed_at) return this.getPreviousPlayerAlive(prevPlayer, [...idsBlacklist, prevPlayer.id]);
    return prevPlayer;
  }

  async getCurrentTarget(player: PlayerRecord): Promise<PlayerRecord> {
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

  async countTotalPlayersKilled(): Promise<number> {
    const count = await this.#db("players").whereNotNull("killed_at").count().first();
    return Number(count?.["count(*)"]);
  }

  async countPlayersEliminatedLast6Months(): Promise<number> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const count = await this.#db("players")
      .whereNotNull("killed_at")
      .andWhere("killed_at", ">=", sixMonthsAgo.toISOString())
      .count()
      .first();
    return Number(count?.["count(*)"]);
  }

  /** Remove private fields */
  sanitize(player: PlayerRecord): PlayerRecordSanitized {
    return {
      id: player.id,
      name: player.name,
      game_id: player.game_id,
      avatar: player.avatar,
      avatar_image: !!player.avatar_image,
    };
  }

  /** Remove private fields */
  anonymize(player: PlayerRecord): PlayerRecord {
    return {
      id: `hidden-${crypto.randomUUID()}`,
      name: "hidden",
      action: "hidden",
      kill_token: -1,
      killed_at: player.killed_at,
      killed_by: "hidden",
      order: -1,
      private_token: "hidden",
      game_id: player.game_id,
      avatar: undefined,
      avatar_image: false,
    } as PlayerRecord;
  }
}
