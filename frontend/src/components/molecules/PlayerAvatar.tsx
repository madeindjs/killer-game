"use client";
import { getPlayerAvatarConfig } from "@/utils/avatar";
import { Suspense } from "react";
import Avatar from "react-nice-avatar";
import Loader from "../atoms/Loader";
import { PlayerRecord, PlayerRecordSanitized } from "@killer-game/types";

interface Props {
  player: PlayerRecordSanitized | PlayerRecord;
  size?: "m" | "s";
  killed?: boolean;
  onClick?: () => void;
}
export default function PlayerAvatar({
  player,
  size = "m",
  killed,
  onClick,
}: Props) {
  const avatarConfig = getPlayerAvatarConfig(player);

  return (
    <div
      className={
        "avatar placeholder " + (onClick !== undefined ? "cursor-pointer " : "")
      }
      title={player.name}
      onClick={onClick}
    >
      {player.id === "hidden" ? (
        <div className="w-12 bg-neutral-focus text-neutral-content rounded-full">
          <span className="font-bold text-2xl">?</span>
        </div>
      ) : (
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
      )}
    </div>
  );
}
