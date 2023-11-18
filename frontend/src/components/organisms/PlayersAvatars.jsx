import { useMemo } from "react";
import PlayerAvatar from "../molecules/PlayerAvatar";

/**
 * @typedef Props
 * @property {import('@killer-game/types').PlayerRecord[]} players
 * @property {string} [className]
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [onPlayerClick]
 *
 *
 * @param {{players: , className?: string}} param0
 */
export default function PlayersAvatars({ players, className, onPlayerClick }) {
  const playersSorted = useMemo(() => {
    const collator = new Intl.Collator();
    return [...players].sort((a, b) => collator.compare(a.name, b.name));
  }, [players]);

  return (
    <div className={"avatar-group -space-x-2 " + (className ?? "")}>
      {playersSorted.map((player) => (
        <PlayerAvatar
          player={player}
          key={player.id}
          killed={!!player.killed_}
          size="s"
          onClick={onPlayerClick ? () => onPlayerClick(player) : undefined}
        />
      ))}
    </div>
  );
}
