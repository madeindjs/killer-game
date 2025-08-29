import { genConfig } from "react-nice-avatar";
import type { AvatarConfig } from "react-nice-avatar";
import { PlayerRecordSanitized } from "@killer-game/types";

export function getPlayerAvatarConfig(
  player: PlayerRecordSanitized,
): AvatarConfig {
  if (player.id === "hidden") {
    return genConfig({});
  }

  switch (typeof player.avatar) {
    case "undefined":
      return genConfig(player.name);
    case "object":
      return player.avatar;
    case "string":
      return JSON.parse(player.avatar);
  }
}
