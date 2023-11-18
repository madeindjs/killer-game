import { getPlayerUrl } from "@/lib/routes";
import Link from "next/link";
import Token from "../atoms/Token";
import PlayerAvatarWithStatus from "./PlayerAvatarWithStatus";

/**
 * @typedef PlayersTableRowProps
 * @property {import('@killer-game/types').PlayerRecord | undefined} player
 * @property {() => void} [onEditClick]
 * @property {() => void} [onDeleteClick]
 * @property {() => void} [onAvatarClick]
 * @property {() => void} [onMoveDown]
 * @property {() => void} [onMoveUp]
 * @property {boolean} [editable]
 *
 * @param {PlayersTableRowProps} param0
 */
function PlayersTableRow({ player, onAvatarClick, editable, onDeleteClick, onEditClick, onMoveUp, onMoveDown }) {
  return (
    <tr>
      <td>
        <span>{player.order}</span>
        <button
          className="btn btn-sm join-item"
          disabled={!editable}
          onClick={() => onMoveDown?.()}
          title="Move the player down"
        >
          ↑
        </button>
        <button
          className="btn btn-sm join-item"
          disabled={!editable}
          onClick={() => onMoveUp?.()}
          title="Move the player up"
        >
          ↓
        </button>
      </td>
      <td>
        {player ? (
          <PlayerAvatarWithStatus player={player} onAvatarClick={() => onAvatarClick(player)} />
        ) : (
          "Player not found"
        )}
      </td>
      <td>
        <Token token={player.kill_token} />
      </td>
      <td>
        <div className="join">
          <Link className="btn btn-sm join-item" href={getPlayerUrl(player)} target="_blank">
            Dashboard
          </Link>

          <button className="btn btn-sm join-item" disabled={!editable} onClick={onEditClick}>
            edit
          </button>
          <button className="btn btn-sm btn-error join-item" disabled={!editable} onClick={onDeleteClick}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

/**
 * @typedef PlayersTableProps
 * @property {import('@killer-game/types').PlayerRecord[]} players
 * @property {boolean} [editable]
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerClick]
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [onEditClick]
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [onDeleteClick]
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [onMoveUp]
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [onMoveDown]
 *
 * @param {PlayersTableProps} param0
 */
export default function PlayersTable({
  players,
  onPlayerClick,
  onPlayerUpdate,
  editable,
  onDeleteClick,
  onEditClick,
  onMoveUp,
  onMoveDown,
}) {
  const playersSorted = [...players].sort((a, b) => a.order - b.order);

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Order</th>
            <th>Player</th>
            <th>Secret code</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {playersSorted.map((player) => (
            <PlayersTableRow
              key={player.id}
              player={player}
              editable={editable}
              onAvatarClick={() => onPlayerClick?.(player)}
              onEditClick={() => onEditClick?.(player)}
              onDeleteClick={() => onDeleteClick?.(player)}
              onMoveUp={() => onMoveUp?.(player)}
              onMoveDown={() => onMoveDown?.(player)}
              onPlayerUpdate={onPlayerUpdate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
