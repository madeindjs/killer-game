import { appendFileSync, existsSync, readFileSync, rmSync } from "node:fs";
import { API_URL, GAMES_LEDGER_FILE } from "./env.ts";

export interface GameRef {
  id: string;
  private_token: string;
}

/**
 * Delete a game and everything attached to it.
 *
 * Players are deleted one by one first: SQLite foreign keys are not enforced
 * by the API, so deleting only the game would leave orphan players (and their
 * kills would still be counted in `/stats`).
 *
 * Idempotent: a game which is already gone is silently ignored.
 */
export async function deleteGameCompletely(game: GameRef, apiUrl: string = API_URL): Promise<void> {
  const headers = { Authorization: game.private_token };

  const playersRes = await fetch(`${apiUrl}/games/${game.id}/players`, { headers });
  if (playersRes.status === 404) return;

  if (playersRes.ok) {
    const { data: players } = (await playersRes.json()) as { data: Array<{ id: string }> };
    for (const player of players) {
      const res = await fetch(`${apiUrl}/games/${game.id}/players/${player.id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok && res.status !== 404) {
        throw new Error(`Cannot delete player ${player.id} of game ${game.id}: HTTP ${res.status}`);
      }
    }
  }

  const res = await fetch(`${apiUrl}/games/${game.id}`, { method: "DELETE", headers });
  if (!res.ok && res.status !== 404) {
    throw new Error(`Cannot delete game ${game.id}: HTTP ${res.status}`);
  }
}

/** Record a game on disk so the global teardown can delete it if a worker crashes. */
export function recordInLedger(game: GameRef): void {
  appendFileSync(GAMES_LEDGER_FILE, JSON.stringify({ id: game.id, private_token: game.private_token }) + "\n");
}

export function readLedger(): GameRef[] {
  if (!existsSync(GAMES_LEDGER_FILE)) return [];
  return readFileSync(GAMES_LEDGER_FILE, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as GameRef);
}

export function clearLedger(): void {
  rmSync(GAMES_LEDGER_FILE, { force: true });
}

/**
 * Tracks every game created during one test and deletes them all when the
 * test ends (whether it passed or failed).
 */
export class GameRegistry {
  #games = new Map<string, GameRef>();

  track(game: GameRef): void {
    if (!game?.id || !game.private_token) throw new Error("Cannot track a game without id and private_token");
    if (this.#games.has(game.id)) return;
    this.#games.set(game.id, { id: game.id, private_token: game.private_token });
    recordInLedger(game);
  }

  /**
   * Track a game from its admin dashboard URL, e.g.
   * `https://the-killer.online/en/games/my-game?password=abc`.
   *
   * The URL may contain the slug instead of the id: resolve it with the API.
   */
  async trackFromUrl(url: string): Promise<GameRef> {
    const { pathname, searchParams } = new URL(url);
    const match = /\/games\/([^/]+)/.exec(pathname);
    const password = searchParams.get("password");
    if (!match || !password) throw new Error(`Not an admin game URL: ${url}`);

    const res = await fetch(`${API_URL}/games/${match[1]}`, { headers: { Authorization: password } });
    if (!res.ok) throw new Error(`Cannot fetch game from ${url}: HTTP ${res.status}`);
    const { data } = (await res.json()) as { data: GameRef };

    const game = { id: data.id, private_token: password };
    this.track(game);
    return game;
  }

  get size(): number {
    return this.#games.size;
  }

  async cleanup(): Promise<void> {
    const errors: unknown[] = [];
    for (const game of this.#games.values()) {
      await deleteGameCompletely(game).catch((error) => errors.push(error));
    }
    this.#games.clear();
    if (errors.length) throw new AggregateError(errors, "Some E2E games could not be deleted");
  }
}
