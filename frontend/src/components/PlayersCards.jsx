import { PlayerCard } from "./PlayerCard";

/**
 * @param {{players: any[]}} param0
 */
export default function PlayersCards({ players }) {
  return (
    <div className="overflow-x-auto">
      {players.map((player) => (
        <PlayerCard player={player} key={player.id} />
      ))}
    </div>
  );
}
