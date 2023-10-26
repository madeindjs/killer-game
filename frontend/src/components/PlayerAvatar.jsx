import { getPlayerAvatarConfig } from "@/utils/player";
import { Suspense } from "react";
import Avatar from "react-nice-avatar";
import Loader from "./Loader";

/**
 * @typedef Props
 * @property {import('@killer-game/types').PlayerRecord} player
 * @property {'m' | 's'} [size]
 * @property {boolean} [killed]

 * @param {Props} param0
 */
export default function PlayerAvatar({ player, size = "m", killed }) {
  const avatarConfig = getPlayerAvatarConfig(player);

  return (
    <div className="avatar placeholder" title={player.name}>
      <Suspense fallback={<Loader />}>
        <Avatar
          className={
            "text-neutral-content rounded-full " +
            (size === "s" ? "w-12 " : "w-24 ") +
            (killed ? "filter grayscale" : "")
          }
          {...avatarConfig}
        />
      </Suspense>
    </div>
  );
}
