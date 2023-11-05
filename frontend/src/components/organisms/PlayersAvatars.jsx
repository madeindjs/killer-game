import { useMemo } from "react";
import PlayerAvatar from "../molecules/PlayerAvatar";

/**
 * @param {{players: import('@killer-game/types').PlayerRecord[], className?: string}} param0
 */
export default function PlayersAvatars({ players, className }) {
  const playersSorted = useMemo(() => {
    const collator = new Intl.Collator();
    return [...players].sort((a, b) => collator.compare(a.name, b.name));
  }, [players]);

  return (
    <div className={"avatar-group -space-x-2 " + className}>
      {playersSorted.map((player) => (
        <PlayerAvatar player={player} key={player.id} killed={!!player.killed_at} size="s" />
      ))}
    </div>
  );
}
