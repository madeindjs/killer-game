import { useMemo } from "react";
import PlayerAvatar from "../molecules/PlayerAvatar";
import type { PlayerRecord } from "@killer-game/types";

export default function PlayersAvatars(props: {
  players: PlayerRecord[];
  className?: string;
  onPlayerClick?: (p: PlayerRecord) => void;
}) {
  const playersSorted = useMemo(() => {
    const collator = new Intl.Collator();
    return [...props.players].sort((a, b) => collator.compare(a.name, b.name));
  }, [props.players]);

  return (
    <div className={"avatar-group -space-x-2 " + (props.className ?? "")}>
      {playersSorted.map((player) => (
        <PlayerAvatar
          player={player}
          key={player.id}
          killed={!!player.killed_at}
          size="s"
          onClick={() => props.onPlayerClick?.(player)}
        />
      ))}
    </div>
  );
}
