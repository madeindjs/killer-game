import { useCallback } from "react";
import PlayerActionSelector from "./PlayerActionSelector";
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
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [onPlayerUpdate]
 * @property {() => void} [onAvatarClick]
 * @property {boolean} [editable]
 *
 * @param {PlayersTableRowProps} param0
 * @returns
 */
function PlayersTableRow({ player, target, action, actions, onAvatarClick, editable, onPlayerUpdate }) {
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
        <PlayerActionSelector
          value={action.id}
          actions={actions}
          readonly={!editable}
          onChange={(e) => onPlayerUpdate?.({ ...target, action_id: e })}
        />
      </td>
      <td>
        {target ? (
          <PlayersTableCellPlayer player={target} onAvatarClick={() => onAvatarClick(target)} />
        ) : (
          "Player not found"
        )}
      </td>
    </tr>
  );
}

/**
 * @typedef PlayersTableProps
 * @property {import('@killer-game/types').GamePlayersTable} table
 * @property {import('@killer-game/types').GameActionRecord[]} actions
 * @property {import('@killer-game/types').PlayerRecord[]} players
 * @property {boolean} editable
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerClick]
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [onPlayerUpdate]
 *
 * @param {PlayersTableProps} param0
 */
export default function PlayersTable({ table, players, actions, onPlayerClick, onPlayerUpdate, editable }) {
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
              editable={editable}
              actions={actions}
              action={action}
              onAvatarClick={(p) => onPlayerClick?.(p)}
              onPlayerUpdate={onPlayerUpdate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
