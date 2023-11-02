import { useCallback } from "react";
import PlayerAvatar from "./PlayerAvatar";
import { PlayerStatusBadge } from "./PlayerStatusBadge";

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
 * @property {import('@killer-game/types').PlayerRecord | undefined} target
 * @property {import('@killer-game/types').GameActionRecord | undefined} action
 * @property {() => void} [onAvatarClick]
 * @property {boolean} [editable]
 *
 * @param {PlayersTableRowProps} param0
 * @returns
 */
function PlayersTableRow({ player, target, action, onAvatarClick }) {
  return (
    <tr>
      <td>{player ? <PlayersTableCellPlayer player={player} onAvatarClick={onAvatarClick} /> : "Player not found"}</td>
      <td>{action?.name}</td>
      <td>{target ? <PlayersTableCellPlayer player={target} onAvatarClick={onAvatarClick} /> : "Player not found"}</td>
    </tr>
  );
}

/**
 * @typedef PlayersTableProps
 * @property {import('@killer-game/types').GamePlayersTable} table
 * @property {import('@killer-game/types').PlayerRecord[]} players
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerClick]
 *
 * @param {PlayersTableProps} param0
 */
export default function PlayersTable({ table, players, onPlayerClick, editable }) {
  const findPlayer = useCallback((id) => players.find((p) => p.id === id), [players]);

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Player</th>
            <th>Action</th>
            <th>Target</th>
          </tr>
        </thead>
        <tbody>
          {table.map(({ player, action, target }) => (
            <PlayersTableRow
              key={player.id}
              player={findPlayer(player?.id)}
              target={findPlayer(target?.id)}
              action={action}
              onAvatarClick={() => onPlayerClick?.(player)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
