"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import GameModal from "./GameModal";
import type { GameRecord } from "@killer-game/types";

interface GameEditButtonProps {
  game: GameRecord;
  onGameUpdate: (game: GameRecord) => void;
  onGameDelete: () => void;
  disabled?: boolean;
}

export default function GameEditButton({
  game,
  onGameDelete,
  onGameUpdate,
  disabled,
}: GameEditButtonProps) {
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
        ✏️ {t("GameEditButton.button")}
      </button>
    </>
  );
}