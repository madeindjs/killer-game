import { getPlayerUrl } from "@/lib/routes";
import Link from "next/link";
import PlayerAvatar from "./PlayerAvatar";
import { PlayerStatusBadge } from "./PlayerStatusBadge";
import Token from "./Token";

/**
 * @typedef PlayersTableCellPlayerProps
 * @property {import('@killer-game/types').PlayerRecord} player
 * @property {() => void} [onAvatarClick]
 *
 * @param {PlayersTableRowProps} param0
 * @returns
 */
function PlayersTableCellPlayer({ player, onAvatarClick }) {
  return (
    <>
      <div className="flex items-center space-x-3">
        <PlayerAvatar player={player} size="s" killed={player.killed_by} onClick={onAvatarClick} />
        <div>
          <p className="font-bold mb-1">{player.name}</p>
          <PlayerStatusBadge player={player} />
        </div>
      </div>
    </>
  );
}

/**
 * @typedef PlayersTableRowProps
 * @property {import('@killer-game/types').PlayerRecord | undefined} player
 * @property {() => void} [onEditClick]
 * @property {() => void} [onDeleteClick]
 * @property {() => void} [onAvatarClick]
 * @property {boolean} [editable]
 *
 * @param {PlayersTableRowProps} param0
 * @returns
 */
function PlayersTableRow({ player, actions, onAvatarClick, editable, onDeleteClick, onEditClick }) {
  return (
    <tr>
      <td>
        {player ? (
          <PlayersTableCellPlayer player={player} onAvatarClick={() => onAvatarClick(player)} />
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
 *
 * @param {PlayersTableProps} param0
 */
export default function PlayersTable({ players, onPlayerClick, onPlayerUpdate, editable, onDeleteClick, onEditClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Player</th>
            <th>Secret code</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <PlayersTableRow
              key={player.id}
              player={player}
              editable={editable}
              onAvatarClick={() => onPlayerClick?.(player)}
              onEditClick={() => onEditClick?.(player)}
              onDeleteClick={() => onDeleteClick?.(player)}
              onPlayerUpdate={onPlayerUpdate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
