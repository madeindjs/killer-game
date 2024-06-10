import { getPlayerUrl } from "@/lib/routes";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import DragIcon from "../atoms/IconDrag";
import PlayerAvatarWithStatus from "./PlayerAvatarWithStatus";

/**
 * @typedef PlayersTableRowProps
 * @property {import('@killer-game/types').GameRecord} game
 * @property {import('@killer-game/types').PlayerRecord | undefined} player
 * @property {() => void} [onEditClick]
 * @property {() => void} [onDeleteClick]
 * @property {() => void} [onAvatarClick]
 * @property {() => void} [onMoveDown]
 * @property {() => void} [onMoveUp]
 * @property {boolean} [editable]
 *
 * @param {PlayersTableRowProps} param0
 */
function PlayersTableRow({ game, player, onAvatarClick, editable, onDeleteClick, onEditClick, onMoveUp, onMoveDown }) {
  const t = useTranslations("games");
  const lang = useLocale();
  return (
    <Draggable key={player.id} draggableId={player.id} index={player.order}>
      {(provided, snapshot) => (
        <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <td>
            <DragIcon />
          </td>
          <td>
            {player ? (
              <PlayerAvatarWithStatus player={player} onAvatarClick={() => onAvatarClick(player)} />
            ) : (
              "Player not found"
            )}
          </td>

          <td>
            <div className="join">
              <Link className="btn btn-sm join-item" href={getPlayerUrl(game, player, lang)} target="_blank">
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
      )}
    </Draggable>
  );
}

/**
 *
 * @param {PlayersTableProps} props
 */
function PlayerTableBody(props) {
  const playersSorted = [...props.players].sort((a, b) => a.order - b.order);

  return (
    <tbody>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <>
            {playersSorted.map((player) => (
              <PlayersTableRow
                key={player.id}
                game={props.game}
                player={player}
                editable={props.editable}
                onAvatarClick={() => onPlayerClick?.(player)}
                onEditClick={() => onEditClick?.(player)}
                onDeleteClick={() => onDeleteClick?.(player)}
                onMoveUp={() => onMoveUp?.(player)}
                onMoveDown={() => onMoveDown?.(player)}
                onPlayerUpdate={props.onPlayerUpdate}
              />
            ))}
            {provided.placeholder}
          </>
        )}
      </Droppable>
    </tbody>
  );
}

/**
 * @typedef PlayersTableProps
 * @property {import('@killer-game/types').GameRecord} game
 * @property {import('@killer-game/types').PlayerRecord[]} players
 * @property {boolean} [editable]
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerClick]
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [onEditClick]
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [onDeleteClick]
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [onMoveUp]
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [onMoveDown]
 *
 * @param {PlayersTableProps} param0
 */
export default function PlayersTable(props) {
  const t = useTranslations("games");

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>{t("PlayersTable.head.order")}</th>
            <th>{t("PlayersTable.head.player")}</th>
            <th></th>
          </tr>
        </thead>
        <DragDropContext>
          <PlayerTableBody {...props} />
        </DragDropContext>
      </table>
    </div>
  );
}
