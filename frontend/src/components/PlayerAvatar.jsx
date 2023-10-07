import { getPlayerAvatarConfig } from "@/utils/player";
import Avatar from "react-nice-avatar";

/**
 * @typedef Props
 * @property {import('@killer-game/types').PlayerRecord} player
 * @property {'m' | 's'} [size]
 */

/**
 * @param {Props} param0
 */
export default function PlayerAvatar({ player, size = "m" }) {
  const avatarConfig = getPlayerAvatarConfig(player);

  return (
    <div className="avatar placeholder" title={player.name}>
      <Avatar className={"text-neutral-content rounded-full " + (size === "s" ? "w-12 " : "w-24 ")} {...avatarConfig} />
    </div>
  );
}
