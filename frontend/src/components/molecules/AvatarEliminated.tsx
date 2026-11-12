"use client";

import PlayerAvatar from "./PlayerAvatar";
import type { PlayerRecord, PlayerRecordSanitized } from "@killer-game/types";

interface Props {
  player: PlayerRecord | PlayerRecordSanitized;
  killed: boolean;
  size?: "m" | "s" | "xs";
  delayMs?: number;
}

export default function AvatarEliminated({
  player,
  killed,
  size = "s",
  delayMs = 0,
}: Props) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 animate-fade-in-up"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div
        className={
          "relative transition-transform duration-500 ease-out " +
          (killed ? "scale-90" : "scale-100")
        }
      >
        <PlayerAvatar player={player} size={size} killed={killed} />
        <div
          data-testid="eliminated-cross"
          aria-hidden="true"
          className={
            "absolute inset-0 flex items-center justify-center pointer-events-none " +
            "transition-all duration-500 ease-out " +
            (killed ? "opacity-100 scale-100" : "opacity-0 scale-50")
          }
        >
          <div className="relative w-3/4 h-3/4">
            <div className="absolute left-1/2 top-0 h-full w-1.5 -translate-x-1/2 rotate-45 rounded-full bg-error shadow-lg" />
            <div className="absolute left-1/2 top-0 h-full w-1.5 -translate-x-1/2 -rotate-45 rounded-full bg-error shadow-lg" />
          </div>
        </div>
      </div>
      <p
        className={
          "font-bold text-center transition-colors duration-500 " +
          (killed ? "text-neutral line-through" : "")
        }
      >
        {player.name}
      </p>
    </div>
  );
}
