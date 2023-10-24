import PlayerAvatar from "./PlayerAvatar";

/**
 * @typedef Props
 * @property {import("@killer-game/types").PlayerRecordSanitized} player
 * @property {import("@killer-game/types").GameActionRecord} action
 *
 *
 * @param {Props} param0
 * @returns
 */
export function KillCard({ player, action }) {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex gap-4 mb-3">
          <div className="avatar placeholder">
            <PlayerAvatar player={player} />
          </div>
          <p className="card-title">{player.name}</p>
        </div>
        <p>{action.name}</p>
        <div className="card-actions justify-end">
          <a className="btn btn-primary">I accomplished the mission</a>
        </div>
      </div>
    </div>
  );
}
