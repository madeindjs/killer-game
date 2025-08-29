import { PlayerRecordSanitized, PlayerRecord } from "@killer-game/types";

export function isPlayerRecord(player: unknown): player is PlayerRecord {
  return (
    typeof player === "object" && player !== null && "private_token" in player
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
