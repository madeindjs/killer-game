import { deleteGameCompletely, readLedger, writeLedger } from "./fixtures/cleanup.ts";

/**
 * Safety net: every game created by the suite is recorded in a ledger file.
 * Tests delete their own games, but if a worker crashed or was killed, the
 * leftovers are deleted here. Deleting an already deleted game is a no-op.
 *
 * Games which cannot be deleted (e.g. the API is down) stay in the ledger and
 * are retried at the end of the next run.
 */
export default async function globalTeardown(): Promise<void> {
  const remaining = [];

  for (const game of readLedger()) {
    try {
      await deleteGameCompletely(game);
    } catch (error) {
      remaining.push(game);
      console.warn(`[e2e] game ${game.id} could not be deleted: ${String(error)}`);
    }
  }

  writeLedger(remaining);

  if (remaining.length) {
    console.warn(`[e2e] ${remaining.length} game(s) left in ${"e2e/.e2e-games.jsonl"}, retried on the next run.`);
  }
}
