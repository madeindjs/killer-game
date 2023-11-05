import { STYLES } from "@/constants/styles";
import { Suspense, useState } from "react";
import CardSection from "../atoms/CardSection";
import Modal from "../molecules/Modal";
import GameJoinLink from "../organisms/GameJoinLink";
import PlayerCreateForm from "../organisms/PlayerCreateForm";

/**
 * @typedef Props
 * @property {import("@killer-game/types").GameRecord} game
 * @property {import("@killer-game/types").PlayerRecord[]} players
 * @property {any} onPlayerCreate
 *
 * @param {Props} param0
 * @returns
 */
export default function GameDashboardInvite({ game, players, onPlayerCreate }) {
  const [newPlayerModalOpen, setNewPlayerModalOpen] = useState(false);

  return (
    <CardSection>
      <h2 className={STYLES.h2}>Invite more players</h2>
      {game.started_at ? (
        <p className="text-warning">The game started, you cannot invite new persons in the game.</p>
      ) : (
        <>
          <p>You can share the following URL of the game and let user register to this game.</p>
          <GameJoinLink game={game} />
          <div className="divider">OR</div>
          <p>You can add players yourself and share his dashboard link later.</p>
          <button type="button" className="btn btn-secondary" onClick={() => setNewPlayerModalOpen(true)}>
            ➕ Add a player
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
