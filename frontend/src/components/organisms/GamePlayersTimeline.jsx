"use client";
import { useCallback } from "react";
import PlayerActionSelector from "./PlayerActionSelector";
import PlayerAvatarWithStatus from "./PlayerAvatarWithStatus";

/**
 * @typedef PlayersTableRowProps
 * @property {import('@/models').PlayerRecord | undefined} player
 * @property {import('@/models').PlayerRecord | undefined} target
 * @property {import('@killer-game/types').GameActionRecord | undefined} action
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [onPlayerUpdate]
 * @property {() => void} [onAvatarClick]
 * @property {boolean} [editable]
 *
 * @param {PlayersTableRowProps} param0
 */
function GamePlayersTimelineRow({ player, target, action, actions, onAvatarClick, editable, onPlayerUpdate }) {
  return (
    <div className="flex gap-4 items-center">
      <PlayerAvatarWithStatus player={player ?? {}} onAvatarClick={() => onAvatarClick(player)} />
      {editable ? (
        <PlayerActionSelector
          value={action.id}
          actions={actions}
          onChange={(e) => onPlayerUpdate?.({ ...target, action_id: e })}
        />
      ) : (
        <p className="text-center">{action.name}</p>
      )}

      <PlayerAvatarWithStatus player={target ?? {}} onAvatarClick={() => onAvatarClick(target)} />
    </div>
  );
}

/**
 * @typedef GamePlayersTimelineProps
 * @property {import('@killer-game/types').GamePlayersTable} table
 * @property {import('@killer-game/types').GameActionRecord[]} actions
 * @property {import('@/models').PlayerRecord[]} players
 * @property {boolean} editable
 * @property {(player: import('@/models').PlayerRecord) => void} [onPlayerClick]
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [onPlayerUpdate]
 *
 * @param {GamePlayersTimelineProps} param0
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
