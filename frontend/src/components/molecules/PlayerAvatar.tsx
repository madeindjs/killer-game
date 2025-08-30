"use client";
import { getPlayerAvatarConfig } from "@/utils/avatar";
import { Suspense } from "react";
import Avatar from "react-nice-avatar";
import Loader from "../atoms/Loader";
import { PlayerRecord, PlayerRecordSanitized } from "@killer-game/types";

type Size = "m" | "s" | "xs";

interface Props {
  player: PlayerRecordSanitized | PlayerRecord;
  size?: Size;
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

  const sizeClass: Record<Size, string> = {
    xs: "w-8",
    s: "w-12",
    m: "w-24",
  };

  return (
    <div
      className={
        "avatar placeholder " + (onClick !== undefined ? "cursor-pointer " : "")
      }
      title={player.name}
      onClick={onClick}
    >
      {player.id === "hidden" ? (
        <div
          className={
            "bg-neutral-focus text-neutral-content rounded-full " +
            sizeClass[size]
          }
        >
          <span className="font-bold text-2xl">?</span>
        </div>
      ) : (
        <Suspense fallback={<Loader />}>
          <Avatar
            className={
              "text-neutral-content rounded-full " +
              sizeClass[size] +
              (killed ? " filter grayscale" : "")
            }
            {...avatarConfig}
          />
        </Suspense>
      )}
    </div>
  );
}
