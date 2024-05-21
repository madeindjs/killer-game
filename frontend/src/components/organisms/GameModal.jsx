import { useTranslations as useTranslation } from "next-intl";
import GameForm from "../molecules/GameForm";
import Modal from "../molecules/Modal";

/**
 * @typedef PlayerModalProps
 * @property {import("@killer-game/types").GameRecord | undefined} game
 * @property {(game: import("@killer-game/types").GameRecord) => void} onGameUpdate
 * @property {() => void} onGameDelete
 * @property {() => void} onClosed
 * @property {import("@killer-game/types").GameActionRecord[]} actions
 *
 * @param {PlayerModalProps} param0
 * @returns
 */
export default function GameModal({ game, onGameUpdate, onClosed, onGameDelete }) {
  const t = useTranslation("games");
  return (
    <Modal
      isOpen={!!game}
      title={t("GameModal.title")}
      onClosed={onClosed}
      content={game && <GameForm game={game} onSubmit={onGameUpdate} />}
      actions={
        game && (
          <div className="join">
            <button className="btn btn-link text-error join-item" onClick={() => onGameDelete?.()}>
              {t("delete")}
            </button>
          </div>
        )
      }
    />
  );
}
