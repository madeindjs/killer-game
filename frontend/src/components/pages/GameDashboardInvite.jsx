import { STYLES } from "@/constants/styles";
import { Suspense, useState } from "react";
import CardSection from "../atoms/CardSection";
import Modal from "../molecules/Modal";
import GameJoinLink from "../organisms/GameJoinLink";
import PlayerCreateForm from "../organisms/PlayerCreateForm";

/**
 * @typedef GameDashboardInviteI18n
 * @property {string} title
 * @property {string} gameStarted
 * @property {string} linkDescription
 * @property {string} or
 * @property {string} addPlayerDescription
 * @property {string} addPlayerButton
 */

/**
 * @typedef GameDashboardInviteProps
 * @property {import("@killer-game/types").GameRecord} game
 * @property {import("@killer-game/types").PlayerRecord[]} players
 * @property {any} onPlayerCreate
 * @property {GameDashboardInviteI18n} i18n
 *
 * @param {GameDashboardInviteProps} param0
 */
export default function GameDashboardInvite({ game, players, onPlayerCreate, i18n }) {
  const [newPlayerModalOpen, setNewPlayerModalOpen] = useState(false);

  return (
    <CardSection>
      <h2 className={STYLES.h2}>{i18n.title}</h2>
      {game.started_at ? (
        <p className="text-warning">{i18n.gameStarted}</p>
      ) : (
        <>
          <p>{i18n.linkDescription}</p>
          <GameJoinLink game={game} />
          <div className="divider">{i18n.or}</div>
          <p>{i18n.addPlayerDescription}</p>
          <button type="button" className="btn btn-secondary" onClick={() => setNewPlayerModalOpen(true)}>
            ➕ {i18n.addPlayerButton}
          </button>
          <Modal
            isOpen={newPlayerModalOpen}
            title="Add new player"
            onClosed={() => setNewPlayerModalOpen(false)}
            content={
              <Suspense fallback={<p>Loading player form</p>}>
                <PlayerCreateForm
                  defaultName={`Player ${players.length + 1}`}
                  onSubmit={(player) => {
                    onPlayerCreate(player);
                    setNewPlayerModalOpen(false);
                  }}
                  actions={game.actions}
                />
              </Suspense>
            }
          />
        </>
      )}
    </CardSection>
  );
}
