import { getPlayerUrl } from "@/lib/routes";
import Link from "next/link";
import { useCallback, useState } from "react";
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
function PlayersTableCellPlayer({ player, editable, onPlayerUpdate, onPlayerDelete }) {
  const [showEditModal, setShowEditModal] = useState();
  return (
    <>
      <div className="flex items-center space-x-3">
        <PlayerAvatar player={player} size="s" killed={player.killed_by} />
        <div>
          <p className="font-bold">{player.name}</p>
          <ul className="flex flex-wrap gap-1 ">
            <li>
              <Link href={getPlayerUrl(player)} className="text-sm opacity-50" target="_blank" prefetch={false}>
                Dashboard
              </Link>
            </li>
            {editable && (
              <>
                <li>
                  <button className="text-sm opacity-50" onClick={() => setShowEditModal(!showEditModal)}>
                    Edit
                  </button>
                </li>
                <li>
                  <button className="text-sm opacity-50" onClick={() => onPlayerDelete?.(player)}>
                    delete
                  </button>
                </li>
              </>
            )}
          </ul>
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
function PlayersTableRow({ player, target, action, editable, onPlayerUpdate, onPlayerDelete }) {
  return (
    <tr>
      <th>
        <label>
          <input type="checkbox" className="checkbox" />
        </label>
      </th>
      <td>
        <PlayersTableCellPlayer
          player={player}
          editable={editable}
          onPlayerUpdate={onPlayerUpdate}
          onPlayerDelete={onPlayerDelete}
        />
      </td>
      <td>
        {action.name}
        <br />
        <span className="badge badge-ghost badge-sm">Desktop Support Technician</span>
      </td>
      <td>
        <PlayersTableCellPlayer player={target} editable={editable} onPlayerUpdate={onPlayerUpdate} />
      </td>
    </tr>
  );
}

/**
 * @typedef PlayersTableProps
 * @property {import('@killer-game/types').GamePlayersTable} table
 * @property {import('@killer-game/types').PlayerRecord[]} players
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerUpdate]
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerDelete]
 * @property {boolean} [editable]
 *
 * @param {PlayersTableProps} param0
 */
export default function PlayersTable({ table, players, onPlayerUpdate, onPlayerDelete, editable }) {
  const findPlayer = useCallback((id) => players.find((p) => p.id === id), [players]);

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
          </tr>
        </thead>
        <tbody>
          {table.map(({ player, action, target }) => (
            <PlayersTableRow
              key={player.id}
              player={findPlayer(player.id)}
              target={findPlayer(target.id)}
              action={action}
              editable={editable}
              onPlayerUpdate={onPlayerUpdate}
              onPlayerDelete={onPlayerDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
