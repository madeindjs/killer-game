import { AvatarConfig, genConfig } from "react-nice-avatar";

/**
 *
 * @param {import('@killer-game/types').PlayerRecord} player player
 * @returns {AvatarConfig}
 */
export function getPlayerAvatarConfig(player) {
  switch (typeof player.avatar) {
    case "undefined":
      return genConfig(player.name);
    case "object":
      return player.avatar;
    case "string":
      return JSON.parse(player.avatar);
  }
}
