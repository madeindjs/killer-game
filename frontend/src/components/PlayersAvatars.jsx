import PlayerAvatar from "./PlayerAvatar";

/**
 * @param {{players: import('@killer-game/types').PlayerRecord[], className?: string}} param0
 */
export default function PlayersAvatars({ players, className }) {
  return (
    <div className={"avatar-group -space-x-6 " + className}>
      {players.map((player) => (
        <PlayerAvatar player={player} key={player.id} size="s" />
      ))}
    </div>
  );
}
