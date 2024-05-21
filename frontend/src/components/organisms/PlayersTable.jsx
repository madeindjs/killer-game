"use client";
import { getPlayerUrl } from "@/lib/routes";
import { useTranslations as useTranslation } from "next-intl";
import Link from "next/link";
import Token from "../atoms/Token";
import PlayerAvatarWithStatus from "./PlayerAvatarWithStatus";

/**
 * @typedef PlayersTableRowProps
 * @property {import('@/models').PlayerRecord | undefined} player
 * @property {() => void} [onEditClick]
 * @property {() => void} [onDeleteClick]
 * @property {() => void} [onAvatarClick]
 * @property {() => void} [onMoveDown]
 * @property {() => void} [onMoveUp]
 * @property {boolean} [editable]
 *
 * @param {PlayersTableRowProps} param0
 */
function PlayersTableRow({ player, onAvatarClick, editable, onDeleteClick, onEditClick, onMoveUp, onMoveDown }) {
  const t = useTranslation("games");
  return (
    <tr>
      <td>
        <button
          className="btn btn-sm join-item"
          disabled={!editable}
          onClick={() => onMoveDown?.()}
          title={t("PlayersTable.row.moveDown")}
        >
          ↑
        </button>
        <button
          className="btn btn-sm join-item"
          disabled={!editable}
          onClick={() => onMoveUp?.()}
          title={t("PlayersTable.row.up")}
        >
          ↓
        </button>
      </td>
      <td>
        {player ? (
          <PlayerAvatarWithStatus player={player} onAvatarClick={() => onAvatarClick(player)} />
        ) : (
          "Player not found"
        )}
      </td>
      <td>
        <Token token={player.killToken} />
      </td>
      <td>
        <div className="join">
          <Link className="btn btn-sm join-item" href={getPlayerUrl(player)} target="_blank">
            {t("PlayersTable.row.dashboard")}
          </Link>

          <button className="btn btn-sm join-item" disabled={!editable} onClick={onEditClick}>
            {t("PlayersTable.row.edit")}
          </button>
          <button className="btn btn-sm btn-error join-item" disabled={!editable} onClick={onDeleteClick}>
            {t("PlayersTable.row.delete")}
          </button>
        </div>
      </td>
    </tr>
  );
}

/**
 * @typedef PlayersTableProps
 * @property {import('@/models').PlayerRecord[]} players
 * @property {boolean} [editable]
 * @property {(player: import('@/models').PlayerRecord) => void} [onPlayerClick]
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [onEditClick]
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [onDeleteClick]
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [onMoveUp]
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [onMoveDown]
 *
 * @param {PlayersTableProps} param0
 */
export default function PlayersTable({
  players,
  onPlayerClick,
  onPlayerUpdate,
  editable,
  onDeleteClick,
  onEditClick,
  onMoveUp,
  onMoveDown,
}) {
  const t = useTranslation("games");
  const playersSorted = [...players].sort((a, b) => a.order - b.order);

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>{t("PlayersTable.head.order")}</th>
            <th>{t("PlayersTable.head.player")}</th>
            <th>{t("PlayersTable.head.secretCode")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {playersSorted.map((player) => (
            <PlayersTableRow
              key={player.id}
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
