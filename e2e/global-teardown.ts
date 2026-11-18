import { clearLedger, deleteGameCompletely, readLedger } from "./fixtures/cleanup.ts";

/**
 * Safety net: every game created by the suite is recorded in a ledger file.
 * Tests delete their own games, but if a worker crashed or was killed, the
 * leftovers are deleted here. Deleting an already deleted game is a no-op.
 */
export default async function globalTeardown(): Promise<void> {
  const games = readLedger();
  const failures: string[] = [];

  for (const game of games) {
    await deleteGameCompletely(game).catch((error: unknown) => failures.push(`${game.id}: ${String(error)}`));
  }

  clearLedger();

  if (failures.length) {
    console.warn(`[e2e] ${failures.length} game(s) could not be deleted:\n${failures.join("\n")}`);
  }
}
