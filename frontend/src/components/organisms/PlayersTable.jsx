import { getPlayerUrl } from "@/lib/routes";
import { useLocale, useTranslations } from "next-intl";
import PlayerAvatarWithStatus from "./PlayerAvatarWithStatus";

/**
 * @import { GameRecord, PlayerRecord } from "@killer-game/types"
 */

/**
 * @typedef PlayersTableRowProps
 * @property {GameRecord} game
 * @property {PlayerRecord} player
 * @property {() => void} [onEditClick]
 * @property {() => void} [onDeleteClick]
 * @property {() => void} [onAvatarClick]
 * @property {() => void} [onMoveDown]
 * @property {() => void} [onMoveUp]
 * @property {boolean} [editable]
 *
 * @param {PlayersTableRowProps} param0
 */
function PlayersTableRow({
  game,
  player,
  onAvatarClick,
  editable,
  onDeleteClick,
  onEditClick,
  onMoveUp,
  onMoveDown,
}) {
  const t = useTranslations("games");
  const lang = useLocale();
  return (
    <tr>
      <td>
        {player ? (
          <PlayerAvatarWithStatus
            player={player}
            onAvatarClick={() => onAvatarClick?.()}
            layout="horizontal"
          />
        ) : (
          "Player not found"
        )}
      </td>

      <td className="flex flex-wrap gap-2 justify-end">
        <div className="join">
          <button
            className="btn btn-sm join-item"
            type="button"
            disabled={!editable}
            onClick={() => onMoveDown?.()}
            title={t("PlayersTable.row.moveUp")}
          >
            ↑
          </button>
          <button
            className="btn btn-sm join-item"
            type="button"
            disabled={!editable}
            onClick={() => onMoveUp?.()}
            title={t("PlayersTable.row.moveDown")}
          >
            ↓
          </button>
        </div>
        <div className="join">
          <a
            className="btn btn-sm join-item"
            href={getPlayerUrl(game, player, lang)}
            target="_blank"
          >
            {t("PlayersTable.row.dashboard")}
          </a>

          <button
            className="btn btn-sm join-item"
            disabled={!editable}
            type="button"
            onClick={onEditClick}
            aria-label={t("PlayersTable.row.edit")}
          >
            ✏️
          </button>
          <button
            className="btn btn-sm text-error join-item"
            disabled={!editable}
            type="button"
            onClick={onDeleteClick}
            aria-label={t("PlayersTable.row.delete")}
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
}

/**
 * @typedef PlayersTableProps
 * @property {GameRecord} game
 * @property {PlayerRecord[]} players
 * @property {boolean} [editable]
 * @property {(player: PlayerRecord) => void} [onPlayerClick]
 * @property {(player: PlayerRecord) => void} [onPlayerUpdate]
 * @property {(player: PlayerRecord) => void} [onEditClick]
 * @property {(player: PlayerRecord) => void} [onDeleteClick]
 * @property {(player: PlayerRecord) => void} [onMoveUp]
 * @property {(player: PlayerRecord) => void} [onMoveDown]
 *
 * @param {PlayersTableProps} param0
 */
export default function PlayersTable({
  game,
  players,
  onPlayerClick,
  onPlayerUpdate,
  editable,
  onDeleteClick,
  onEditClick,
  onMoveUp,
  onMoveDown,
}) {
  const t = useTranslations("games");
  const playersSorted = [...players].sort((a, b) => a.order - b.order);

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>{t("PlayersTable.head.player")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {playersSorted.map((player) => (
            <PlayersTableRow
              key={player.id}
              game={game}
              player={player}
              editable={editable}
              onAvatarClick={() => onPlayerClick?.(player)}
              onEditClick={() => onEditClick?.(player)}
              onDeleteClick={() => onDeleteClick?.(player)}
              onMoveUp={() => onMoveUp?.(player)}
              onMoveDown={() => onMoveDown?.(player)}
              onPlayerUpdate={onPlayerUpdate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
