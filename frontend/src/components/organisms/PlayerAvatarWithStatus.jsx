"use client";
import PlayerAvatar from "../molecules/PlayerAvatar";
import { isPlayerHidden } from "@/utils/player";

/**
 * @typedef Props
 * @property {import('@killer-game/types').PlayerRecord} player
 * @property {"horizontal" | 'vertical'} [layout]
 * @property {() => void} [onAvatarClick]
 *
 * @param {Props} props
 * @returns
 */
export default function PlayerAvatarWithStatus(props) {
  const killed = Boolean(props.player.killed_at);
  const hidden = isPlayerHidden(props.player);
  return (
    <>
      <div className={`flex ${props.layout === "horizontal" ? "" : "flex-col"} items-center justify-center gap-2 `}>
        <PlayerAvatar player={props.player} size="s" killed={killed} onClick={props.onAvatarClick} />
        <p
          className={`font-bold ${props.layout === "horizontal" ? "" : "text-center"} ml-0 mr-0 ${
            killed ? "text-neutral" : ""
          }`}
        >
          {hidden ? "🕵️" : props.player.name}
        </p>
      </div>
    </>
  );
}
