import PlayerAvatar from "./PlayerAvatar";

/**
 * @param {{players: PlayerRecord[]}} param0
 */
export default function PlayersAvatars({ players }) {
  return (
    <div className="avatar-group -space-x-6">
      {players.map((player) => (
        <PlayerAvatar player={player} key={player.id} size="s" />
      ))}
    </div>
  );
}
