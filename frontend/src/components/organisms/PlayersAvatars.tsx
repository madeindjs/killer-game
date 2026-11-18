"use client";
import { useMemo } from "react";
import PlayerAvatar from "../molecules/PlayerAvatar";
import type { PlayerRecord, PlayerRecordSanitized } from "@killer-game/types";
import { isPlayerDead, isPlayerRecord } from "@/utils/player";

export default function PlayersAvatars(props: {
  players: Array<PlayerRecord | PlayerRecordSanitized | undefined | null>;
  className?: string;
  /** IDs of the connected players: shows a presence indicator on every avatar when set. */
  connectedPlayerIds?: string[];
  onPlayerClick?: (p: PlayerRecord) => void;
}) {
  const playersSorted = useMemo(() => {
    const collator = new Intl.Collator();
    return [...props.players].filter(Boolean).sort((a, b) =>
      collator.compare(a.name, b.name),
    );
  }, [props.players]);

  return (
    <div className={"avatar-group -space-x-2 " + (props.className ?? "")}>
      {playersSorted.map((player) => (
        <PlayerAvatar
          player={player}
          key={player.id}
          killed={isPlayerDead(player)}
          online={props.connectedPlayerIds?.includes(player.id)}
          size="s"
          onClick={() =>
            isPlayerRecord(player) && props.onPlayerClick?.(player)
          }
        />
      ))}
    </div>
  );
}
