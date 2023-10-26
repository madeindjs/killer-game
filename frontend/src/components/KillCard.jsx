import KillCardForm from "./KillCardForm";
import PlayerAvatar from "./PlayerAvatar";

/**
 * @typedef Props
 * @property {import("@killer-game/types").PlayerRecord} player
 * @property {import("@killer-game/types").PlayerRecordSanitized} target
 * @property {import("@killer-game/types").GameActionRecord} action
 *
 *
 * @param {Props} param0
 * @returns
 */
export function KillCard({ player, target, action }) {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex gap-4 mb-3">
          <div className="avatar placeholder">
            <PlayerAvatar player={target} />
          </div>
          <p className="card-title">{target.name}</p>
        </div>
        <p>{action.name}</p>
        <div className="card-actions">
          <KillCardForm playerId={player.id} privateToken={player.private_token} targetId={target.id} />
        </div>
      </div>
    </div>
  );
}
