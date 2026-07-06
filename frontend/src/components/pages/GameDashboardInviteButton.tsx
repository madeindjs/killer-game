"use client";
import { useTranslations } from "next-intl";
import { Suspense, useState } from "react";
import Modal from "../molecules/Modal";
import GameJoinLink from "../organisms/GameJoinLink";
import PlayerCreateForm from "../organisms/PlayerCreateForm";
import type { GameRecord, PlayerRecord } from "@killer-game/types";

interface GameDashboardInviteButtonProps {
  game: GameRecord;
  players: PlayerRecord[];
  disabled?: boolean;
  onPlayerCreate: (
    player: PlayerRecord,
    avatarFile?: File | null,
  ) => void;
}

export default function GameDashboardInviteButton({
  game,
  players,
  onPlayerCreate,
  disabled,
}: GameDashboardInviteButtonProps) {
  const [newPlayerModalOpen, setNewPlayerModalOpen] = useState(false);
  const t = useTranslations("games");

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => setNewPlayerModalOpen(true)}
        disabled={disabled}
        title={disabled ? t("GameDashboardInvite.gameStarted") : undefined}
      >
        ➕ {t("GameDashboardInvite.addPlayerButton")}
      </button>
      {disabled && (
        <p className="text-warning text-sm mt-1">
          {t("GameDashboardInvite.gameStarted")}
        </p>
      )}
      <Modal
        isOpen={newPlayerModalOpen}
        title={t("GameDashboardInvite.modalTitle")}
        onClosed={() => setNewPlayerModalOpen(false)}
        content={
          <>
            <Suspense fallback={<p>Loading player form</p>}>
              <PlayerCreateForm
                defaultName={`Player ${players.length + 1}`}
                allowChangeAction={true}
                onSubmit={(player: PlayerRecord, avatarFile?: File | null) => {
                  onPlayerCreate(player, avatarFile);
                  setNewPlayerModalOpen(false);
                }}
              />
            </Suspense>
            <div className="divider">{t("GameDashboardInvite.or")}</div>
            <p>{t("GameDashboardInvite.linkDescription")}</p>
            <GameJoinLink game={game} />
          </>
        }
      />
    </>
  );
}