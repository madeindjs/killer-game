"use client";
import { STYLES } from "@/constants/styles";
import { useTranslations } from "next-intl";
import { Suspense, useState } from "react";
import CardSection from "../atoms/CardSection";
import Modal from "../molecules/Modal";
import GameJoinLink from "../organisms/GameJoinLink";
import PlayerCreateForm from "../organisms/PlayerCreateForm";

/**
 * @typedef GameDashboardInviteProps
 * @property {import("@killer-game/types").GameRecord} game
 * @property {import("@killer-game/types").PlayerRecord[]} players
 * @property {any} onPlayerCreate
 *
 * @param {GameDashboardInviteProps} param0
 */
export default function GameDashboardInvite({ game, players, onPlayerCreate }) {
  const [newPlayerModalOpen, setNewPlayerModalOpen] = useState(false);
  const t = useTranslations("games");

  return (
    <CardSection>
      <h2 className={STYLES.h2}>{t("GameDashboardInvite.title")}</h2>
      {game.started_at ? (
        <p className="text-warning">{t("GameDashboardInvite.gameStarted")}</p>
      ) : (
        <>
          <p>{t("GameDashboardInvite.linkDescription")}</p>
          <GameJoinLink game={game} />
          <div className="divider">{t("GameDashboardInvite.or")}</div>
          <p>{t("GameDashboardInvite.addPlayerDescription")}</p>
          <button type="button" className="btn btn-secondary" onClick={() => setNewPlayerModalOpen(true)}>
            ➕ {t("GameDashboardInvite.addPlayerButton")}
          </button>
          <Modal
            isOpen={newPlayerModalOpen}
            title={t("GameDashboardInvite.modalTitle")}
            onClosed={() => setNewPlayerModalOpen(false)}
            content={
              <Suspense fallback={<p>Loading player form</p>}>
                <PlayerCreateForm
                  defaultName={`Player ${players.length + 1}`}
                  onSubmit={(player) => {
                    onPlayerCreate(player);
                    setNewPlayerModalOpen(false);
                  }}
                />
              </Suspense>
            }
          />
        </>
      )}
    </CardSection>
  );
}
