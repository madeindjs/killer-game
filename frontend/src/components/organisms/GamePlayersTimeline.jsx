import { useCallback } from "react";
import PlayerAvatar from "../molecules/PlayerAvatar";
import { PlayerStatusBadge } from "../molecules/PlayerStatusBadge";
import PlayerActionSelector from "./PlayerActionSelector";

/**
 * @typedef PlayersTableCellPlayerProps
 * @property {import('@killer-game/types').PlayerRecord} player
 * @property {() => void} [onAvatarClick]
 *
 * @param {PlayersTableRowProps} param0
 * @returns
 */
function GamePlayersTimelineRowPlayer({ player, onAvatarClick }) {
  return (
    <div className="flex items-center space-x-3">
      <PlayerAvatar player={player} size="s" killed={player.killed_by} onClick={onAvatarClick} />
      <div>
        <p className="font-bold mb-1">{player.name}</p>
        <PlayerStatusBadge player={player} />
      </div>
    </div>
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
function GamePlayersTimelineRow({ player, target, action, actions, onAvatarClick, editable, onPlayerUpdate }) {
  return (
    <div className="grid  gap-4">
      {player ? (
        <GamePlayersTimelineRowPlayer player={player} onAvatarClick={() => onAvatarClick(player)} />
      ) : (
        "Player not found"
      )}
      <div className="pl-14 col-span-4">
        <PlayerActionSelector
          value={action.id}
          actions={actions}
          readonly={!editable}
          onChange={(e) => onPlayerUpdate?.({ ...target, action_id: e })}
        />
      </div>
      {target ? (
        <GamePlayersTimelineRowPlayer player={target} onAvatarClick={() => onAvatarClick(target)} />
      ) : (
        "Player not found"
      )}
    </div>
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
export default function GamePlayersTimeline({ table, players, actions, onPlayerClick, onPlayerUpdate, editable }) {
  const findPlayer = useCallback((id) => players.find((p) => p.id === id), [players]);

  return (
    <div>
      {table.map(({ player, action, target }, index) => (
        <>
          <GamePlayersTimelineRow
            key={player.id}
            player={findPlayer(player?.id)}
            target={findPlayer(target?.id)}
            editable={editable}
            actions={actions}
            action={action}
            onAvatarClick={(p) => onPlayerClick?.(p)}
            onPlayerUpdate={onPlayerUpdate}
          />
          {index + 1 !== table.length && <div className="divider" key={player.id + "-divider"}></div>}
        </>
      ))}
    </div>
  );
}
