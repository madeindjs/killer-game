import { KillerClient } from "@killer-game/client";
import type { GameRecord, PlayerRecord } from "@killer-game/types";
import { API_URL, GAME_NAME_PREFIX } from "./env.ts";
import type { GameRegistry } from "./cleanup.ts";

/** Unique, recognizable game name: `[E2E] <label> <timestamp-random>`. */
export function uniqueGameName(label: string): string {
  const suffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  return `${GAME_NAME_PREFIX} ${label} ${suffix}`;
}

/**
 * API shortcuts used to arrange test data quickly. Every game created here is
 * tracked by the registry and deleted at the end of the test.
 */
export class Api {
  readonly client: KillerClient;
  readonly #games: GameRegistry;

  constructor(games: GameRegistry, apiUrl: string = API_URL) {
    this.client = new KillerClient(apiUrl);
    this.#games = games;
  }

  async createGame(label: string): Promise<GameRecord> {
    const game = await this.client.createGame({ name: uniqueGameName(label), organizer_email: "" });
    this.#games.track(game);
    return game;
  }

  async addPlayer(game: GameRecord, name: string, action = `say "${name}" out loud`): Promise<PlayerRecord> {
    return this.client.createPlayer(game.id, { name, action, game_id: game.id } as never);
  }

  async addPlayers(game: GameRecord, names: string[]): Promise<PlayerRecord[]> {
    const players: PlayerRecord[] = [];
    // sequentially: players are inserted at a random position of the chain
    for (const name of names) players.push(await this.addPlayer(game, name));
    return players;
  }

  async startGame(game: GameRecord): Promise<GameRecord> {
    return this.client.updateGame({ ...game, started_at: new Date().toISOString() });
  }

  async fetchGame(game: GameRecord): Promise<GameRecord> {
    return this.client.fetchGame(game.id, game.private_token);
  }

  /** Full (private) player record, including `kill_token`. */
  async fetchPlayer(player: PlayerRecord): Promise<PlayerRecord> {
    return this.client.fetchPlayer(player.id, player.private_token);
  }

  async fetchPlayers(game: GameRecord): Promise<PlayerRecord[]> {
    return this.client.fetchPlayers(game.id, game.private_token);
  }

  /** Current target of a player (the next alive player in the chain). */
  async fetchTarget(player: PlayerRecord): Promise<{ id: string; name: string }> {
    const status = await this.client.fetchPlayerStatus(player.id, player.private_token);
    return status.current.player as { id: string; name: string };
  }
}
