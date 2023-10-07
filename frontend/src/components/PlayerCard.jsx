import Link from "next/link";
import PlayerAvatar from "./PlayerAvatar";

/**
 * @param {{player: import('@killer-game/types').PlayerRecord}} param0
 * @returns
 */
export function PlayerCard({ player }) {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="avatar placeholder">
          <PlayerAvatar player={player} />
        </div>
        <p className="card-title">{player.name}</p>
        <div className="card-actions justify-end">
          <Link href={`/games/${player.game_id}/players/${player.id}`} className="btn btn-primary">
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
