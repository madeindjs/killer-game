"use client";
import { Fragment, useCallback } from "react";
import InputWithLabel from "../atoms/InputWithLabel";
import PlayerAvatarWithStatus from "./PlayerAvatarWithStatus";

/**
 * @typedef PlayersTableRowProps
 * @property {import('@killer-game/types').PlayerRecord | undefined} player
 * @property {import('@killer-game/types').PlayerRecord | undefined} target
 * @property {string} action
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [onPlayerUpdate]
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [onAvatarClick]
 * @property {boolean} [editable]
 *
 * @param {PlayersTableRowProps} param0
 */
function GamePlayersTimelineRow({
  player,
  target,
  action,
  onAvatarClick,
  editable,
  onPlayerUpdate,
}) {
  return (
    <>
      {player && (
        <PlayerAvatarWithStatus
          player={player}
          onAvatarClick={() => onAvatarClick?.(player)}
        />
      )}
      <div className="flex items-center">
        {editable && target ? (
          <InputWithLabel
            name="action"
            value={action}
            onChange={(e) => onPlayerUpdate?.({ ...target, action: e })}
          />
        ) : (
          <p className="text-center">{action}</p>
        )}
      </div>
      {target && (
        <PlayerAvatarWithStatus
          player={target ?? {}}
          onAvatarClick={() => onAvatarClick?.(target)}
        />
      )}
    </>
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
export default function GamePlayersTimeline({
  table,
  players,
  onPlayerClick,
  onPlayerUpdate,
  editable,
}) {
  const findPlayer = useCallback(
    /** @param {string} id */
    (id) => players.find((p) => p.id === id),
    [players],
  );

  return (
    <div className="grid grid-cols-[auto_1fr_100px] content-center">
      {table.map(({ player, action, target }, index) => (
        <Fragment key={player.id ?? index}>
          <GamePlayersTimelineRow
            player={findPlayer(player?.id)}
            target={findPlayer(target?.id)}
            editable={editable}
            action={action}
            onAvatarClick={(p) => onPlayerClick?.(p)}
            onPlayerUpdate={onPlayerUpdate}
          />
          {index + 1 !== table.length && (
            <div className="divider col-span-3"></div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
