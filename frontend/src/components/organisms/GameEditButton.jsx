"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import GameModal from "./GameModal";

/**
 * @typedef GameEditButtonProps
 * @property {import("@killer-game/types").GameRecord} game
 * @property {(game: import("@killer-game/types").GameRecord) => void} onGameUpdate
 * @property {() => void} onGameDelete
 * @property {boolean} [disabled]
 *
 * @param {GameEditButtonProps} param0
 */
export default function GameEditButton({
  game,
  onGameDelete,
  onGameUpdate,
  disabled,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("game-dashboard");

  return (
    <>
      {isOpen && (
        <GameModal
          game={game}
          onClosed={() => setIsOpen(false)}
          onGameDelete={onGameDelete}
          onGameUpdate={onGameUpdate}
        />
      )}
      <button
        className="btn btn-secondary"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        ✏️&nbsp;{t("GameEditButton.button")}
      </button>
    </>
  );
}
