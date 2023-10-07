import Link from "next/link";
import PlayerAvatar from "./PlayerAvatar";

/**
 * @typedef Props
 * @property {import('@killer-game/types').PlayerRecord} player
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onUpdate]
 */

/**
 * @param {Props} param0
 * @returns
 */
export function PlayerCard({ player, onUpdate }) {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="avatar placeholder">
          <PlayerAvatar
            player={player}
            editable={true}
            onAvatarUpdate={(avatar) => onUpdate?.({ ...player, avatar })}
          />
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
