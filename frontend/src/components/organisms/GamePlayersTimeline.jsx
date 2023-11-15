import useTranslation from "next-translate/useTranslation";
import { useCallback } from "react";
import PlayerActionSelector from "./PlayerActionSelector";
import PlayerAvatarWithStatus from "./PlayerAvatarWithStatus";

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
 */
function GamePlayersTimelineRow({ player, target, action, actions, onAvatarClick, editable, onPlayerUpdate }) {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <PlayerAvatarWithStatus player={player ?? {}} onAvatarClick={() => onAvatarClick(player)} />
        <div className="divider flex-grow">{t("GameTimeline.needsToKill")}</div>
        <PlayerAvatarWithStatus player={target ?? {}} onAvatarClick={() => onAvatarClick(target)} />
      </div>
      <div className="col-span-3">
        <PlayerActionSelector
          value={action.id}
          actions={actions}
          readonly={!editable}
          onChange={(e) => onPlayerUpdate?.({ ...target, action_id: e })}
        />
      </div>
    </div>
  );
}

/**
 * @typedef GamePlayersTimelineProps
 * @property {import('@killer-game/types').GamePlayersTable} table
 * @property {import('@killer-game/types').GameActionRecord[]} actions
 * @property {import('@killer-game/types').PlayerRecord[]} players
 * @property {boolean} editable
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerClick]
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
