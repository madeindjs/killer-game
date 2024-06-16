"use client";
import { useCallback } from "react";
import InputWithLabel from "../atoms/InputWithLabel";
import PlayerAvatarWithStatus from "./PlayerAvatarWithStatus";

/**
 * @typedef PlayersTableRowProps
 * @property {import('@killer-game/types').PlayerRecord | undefined} player
 * @property {import('@killer-game/types').PlayerRecord | undefined} target
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [onPlayerUpdate]
 * @property {() => void} [onAvatarClick]
 * @property {boolean} [editable]
 *
 * @param {PlayersTableRowProps} param0
 */
function GamePlayersTimelineRow({ player, target, action, onAvatarClick, editable, onPlayerUpdate }) {
  return (
    <div className="flex gap-4 items-center">
      <PlayerAvatarWithStatus player={player ?? {}} onAvatarClick={() => onAvatarClick(player)} />
      {editable ? (
        <InputWithLabel value={action} onChange={(e) => onPlayerUpdate?.({ ...target, action: e })} />
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
 * @property {import('@killer-game/types').PlayerRecord[]} players
 * @property {boolean} editable
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerClick]
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [onPlayerUpdate]
 *
 * @param {GamePlayersTimelineProps} param0
 */
export default function GamePlayersTimeline({ table, players, onPlayerClick, onPlayerUpdate, editable }) {
  const findPlayer = useCallback((id) => players.find((p) => p.id === id), [players]);

  return (
    <div>
      {table.map(({ player, action, target }, index) => (
        <>
          <GamePlayersTimelineRow
            key={player.id ?? index}
            player={findPlayer(player?.id)}
            target={findPlayer(target?.id)}
            editable={editable}
            action={action}
            onAvatarClick={(p) => onPlayerClick?.(p)}
            onPlayerUpdate={onPlayerUpdate}
          />
          {index + 1 !== table.length && <div className="divider" key={`divider-${player.id ?? index}`}></div>}
        </>
      ))}
    </div>
  );
}
