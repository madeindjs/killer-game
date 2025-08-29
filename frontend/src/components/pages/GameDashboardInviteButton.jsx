"use client";
import { useTranslations } from "next-intl";
import { Suspense, useState } from "react";
import Modal from "../molecules/Modal";
import GameJoinLink from "../organisms/GameJoinLink";
import PlayerCreateForm from "../organisms/PlayerCreateForm";

/**
 * @typedef GameDashboardInviteProps
 * @property {import("@killer-game/types").GameRecord} game
 * @property {import("@killer-game/types").PlayerRecord[]} players
 * @property {boolean} [disabled]
 * @property {any} onPlayerCreate
 *
 * @param {GameDashboardInviteProps} param0
 */
export default function GameDashboardInviteButton({
  game,
  players,
  onPlayerCreate,
  disabled,
}) {
  const [newPlayerModalOpen, setNewPlayerModalOpen] = useState(false);
  const t = useTranslations("games");

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => setNewPlayerModalOpen(true)}
        disabled={disabled}
      >
        ➕ {t("GameDashboardInvite.addPlayerButton")}
      </button>
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
                onSubmit={(player) => {
                  onPlayerCreate(player);
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
