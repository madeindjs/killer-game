import { useTranslations } from "next-intl";
import GameForm from "../molecules/GameForm";
import Modal from "../molecules/Modal";
import type { GameRecord } from "@killer-game/types";

interface PlayerModalProps {
  game: GameRecord | undefined;
  onGameUpdate: (game: GameRecord) => void;
  onGameDelete: () => void;
  onClosed: () => void;
}

export default function GameModal({
  game,
  onGameUpdate,
  onClosed,
  onGameDelete,
}: PlayerModalProps) {
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
