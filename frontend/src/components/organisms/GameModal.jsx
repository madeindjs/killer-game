import { useTranslations } from "next-intl";
import GameForm from "../molecules/GameForm";
import Modal from "../molecules/Modal";

/**
 * @import { GameRecord } from "@killer-game/types";
 *
 * @typedef PlayerModalProps
 * @property {GameRecord | undefined} game
 * @property {(game: GameRecord) => void} onGameUpdate
 * @property {() => void} onGameDelete
 * @property {() => void} onClosed
 *
 * @param {PlayerModalProps} param0
 */
export default function GameModal({
  game,
  onGameUpdate,
  onClosed,
  onGameDelete,
}) {
  const t = useTranslations("games");
  const tCommon = useTranslations("common");
  return (
    <Modal
      isOpen={!!game}
      title={t("GameModal.title")}
      onClosed={onClosed}
      content={game && <GameForm game={game} onSubmit={onGameUpdate} />}
      actions={
        game && (
          <div className="join">
            <button
              className="btn btn-link text-error join-item"
              onClick={() => onGameDelete?.()}
            >
              {tCommon("delete")}
            </button>
          </div>
        )
      }
    />
  );
}
