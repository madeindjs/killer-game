import { getPlayerUrl } from "@/lib/routes";
import Link from "next/link";
import { useState } from "react";
import Modal from "./Modal";
import PlayerAvatar from "./PlayerAvatar";
import PlayerForm from "./PlayerForm";

/**
 * @typedef PlayersTableCellPlayerProps
 * @property {import('@killer-game/types').PlayerRecord} player
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerUpdate]
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerDelete]
 * @property {boolean} [editable]
 *
 * @param {PlayersTableRowProps} param0
 * @returns
 */
function PlayersTableCellPlayer({ player, editable, onPlayerUpdate }) {
  const [showEditModal, setShowEditModal] = useState();
  return (
    <>
      <div className="flex items-center space-x-3">
        <PlayerAvatar player={player} size="s" killed={player.killed_by} />
        <div>
          <p className="font-bold">{player.name}</p>
          {editable && (
            <button className="text-sm opacity-50" onClick={() => setShowEditModal(!showEditModal)}>
              Edit
            </button>
          )}
        </div>
      </div>
      <Modal
        isOpen={showEditModal}
        title="Edit the player"
        onClosed={() => setShowEditModal(false)}
        content={<PlayerForm player={player} onChange={onPlayerUpdate} />}
      />
    </>
  );
}

/**
 * @typedef PlayersTableRowProps
 * @property {import('@killer-game/types').PlayerRecord} player
 * @property {import('@killer-game/types').PlayerRecord} target
 * @property {import('@killer-game/types').GameActionRecord} action
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerUpdate]
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerDelete]
 * @property {boolean} [editable]
 *
 * @param {PlayersTableRowProps} param0
 * @returns
 */
function PlayersTableRow({ player, target, action, editable, onPlayerUpdate }) {
  return (
    <tr>
      <th>
        <label>
          <input type="checkbox" className="checkbox" />
        </label>
      </th>
      <td>
        <PlayersTableCellPlayer player={player} editable={editable} onPlayerUpdate={onPlayerUpdate} />
      </td>
      <td>
        {action.name}
        <br />
        <span className="badge badge-ghost badge-sm">Desktop Support Technician</span>
      </td>
      <td>
        <PlayersTableCellPlayer player={target} editable={editable} onPlayerUpdate={onPlayerUpdate} />
      </td>
      <th>
        <Link href={getPlayerUrl(player)} className="btn btn-sm" target="_blank" prefetch={false}>
          Dashboard
        </Link>
      </th>
    </tr>
  );
}

/**
 * @typedef PlayersTableProps
 * @property {import('@killer-game/types').GamePlayersTable} table
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerUpdate]
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerDelete]
 * @property {boolean} [editable]
 *
 * @param {PlayersTableProps} param0
 */
export default function PlayersTable({ table, onPlayerUpdate, onPlayerDelete, editable }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>Player</th>
            <th>Action</th>
            <th>Target</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {table.map(({ player, action, target }) => (
            <PlayersTableRow
              key={player.id}
              player={player}
              target={target}
              action={action}
              editable={editable}
              onPlayerUpdate={onPlayerUpdate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
