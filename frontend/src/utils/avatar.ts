import { genConfig } from "react-nice-avatar";
import type { AvatarConfig } from "react-nice-avatar";
import { PlayerRecord, PlayerRecordSanitized } from "@killer-game/types";
import { isPlayerHidden } from "@/utils/player";

/** Parse a stored avatar config; `undefined` when it is missing or malformed. */
function parseAvatar(avatar: unknown): AvatarConfig | undefined {
  if (avatar && typeof avatar === "object") return avatar as AvatarConfig;
  if (typeof avatar !== "string" || !avatar) return undefined;

  try {
    const parsed: unknown = JSON.parse(avatar);
    return parsed && typeof parsed === "object" ? (parsed as AvatarConfig) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Avatar config of a player. Players created through the API or the MCP
 * server may have no avatar (`null`): generate one from their name.
 */
export function getPlayerAvatarConfig(
  player: PlayerRecord | PlayerRecordSanitized,
): AvatarConfig {
  if (isPlayerHidden(player)) {
    return genConfig({});
  }

  return parseAvatar(player.avatar) ?? genConfig(player.name);
}
