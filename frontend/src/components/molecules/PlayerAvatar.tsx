"use client";
import { getPlayerAvatarConfig } from "@/utils/avatar";
import { isPlayerHidden } from "@/utils/player";
import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { PlayerRecord, PlayerRecordSanitized } from "@killer-game/types";

const Avatar = dynamic(
  () => import("react-nice-avatar").then((mod) => mod.default),
  { ssr: false }
);

type Size = "m" | "s" | "xs";

interface Props {
  player: PlayerRecordSanitized | PlayerRecord;
  size?: Size;
  killed?: boolean;
  /** Show a presence indicator when the player is connected. */
  online?: boolean;
  onClick?: () => void;
}
export default function PlayerAvatar({
  player,
  size = "m",
  killed,
  online,
  onClick,
}: Props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const avatarConfig = getPlayerAvatarConfig(player);

  const sizeClass: Record<Size, string> = {
    xs: "w-8",
    s: "w-12",
    m: "w-24",
  };

  const statusSizeClass: Record<Size, string> = {
    xs: "size-2.5",
    s: "size-3",
    m: "size-5",
  };

  // Check if player has a custom uploaded image
  const hasCustomImage = player.avatar_image === true;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const imageUrl = hasCustomImage && player.id && !isPlayerHidden(player)
    ? `${apiUrl}/players/${player.id}/avatar-image`
    : null;

  const hidden = isPlayerHidden(player);

  const avatar = (
    <div
      className={
        "avatar placeholder " + (onClick !== undefined ? "cursor-pointer " : "")
      }
      title={hidden ? "Hidden player" : player.name}
      onClick={onClick}
    >
      {hidden ? (
        <div
          className={
            "bg-neutral-focus text-neutral-content rounded-full " +
            sizeClass[size]
          }
        >
          <span className="font-bold text-2xl">🕵️</span>
        </div>
      ) : hasCustomImage && imageUrl ? (
        // Display custom uploaded image
        <img
          src={imageUrl}
          alt={player.name}
          className={
            "rounded-full object-cover transition-[filter] duration-500 " +
            sizeClass[size] +
            (killed ? " filter grayscale" : "")
          }
          onError={(e) => {
            // Fallback to generated avatar if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      ) : isClient ? (
        <Suspense
          fallback={
            <div className={"skeleton rounded-full " + sizeClass[size] + " aspect-square"} />
          }
        >
          <Avatar
            className={
              "text-neutral-content rounded-full transition-[filter] duration-500 " +
              sizeClass[size] +
              (killed ? " filter grayscale" : "")
            }
            {...avatarConfig}
          />
        </Suspense>
      ) : (
        <div className={"skeleton rounded-full " + sizeClass[size] + " aspect-square"} />
      )}
    </div>
  );

  if (!online || hidden) return avatar;

  // DaisyUI's `avatar-online` is drawn inside the avatar, which is clipped
  // (`overflow: hidden`) in an `avatar-group`: draw the indicator on a wrapper.
  return (
    <div className="relative inline-flex">
      {avatar}
      <span
        role="img"
        aria-label={`${player.name} is connected`}
        title={`${player.name} is connected`}
        className={
          "status status-success absolute bottom-0.5 right-0.5 z-10 rounded-full ring-2 ring-base-100 " +
          statusSizeClass[size]
        }
      />
    </div>
  );
}
