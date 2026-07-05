import { PlayerRecordSanitized, PlayerRecord } from "@killer-game/types";

export function isPlayerRecord(player: unknown): player is PlayerRecord {
  return (
    typeof player === "object" && player !== null && "private_token" in player
  );
}

/**
 * Returns true when the given player has been anonymized by the backend
 * (i.e. its identity should be hidden from the current viewer).
 *
 * The backend anonymizes players by setting their `id` to `hidden-<uuid>`
 * and their `name` to `"hidden"`.
 */
export function isPlayerHidden(
  player: PlayerRecord | PlayerRecordSanitized | undefined | null,
): boolean {
  if (!player) return false;
  return (
    player.id === "hidden" ||
    (typeof player.id === "string" && player.id.startsWith("hidden-")) ||
    player.name === "hidden"
  );
}

export function isPlayerDead(
  player: PlayerRecord | PlayerRecordSanitized,
): boolean {
  return isPlayerRecord(player) && !!player.killed_at;
}

export function mergePlayerRecord<
  T extends PlayerRecordSanitized | PlayerRecord,
>(oldPlayer: T, newPlayer: T): T {
  if (isPlayerRecord(newPlayer)) return newPlayer;

  const ret = { ...oldPlayer };

  for (const key in newPlayer) {
    ret[key] = newPlayer[key];
  }

  return ret;
}
