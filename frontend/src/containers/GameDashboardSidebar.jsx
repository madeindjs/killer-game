"use client";
import GameJoinLink from "@/components/GameJoinLink";
import Modal from "@/components/Modal";
import PlayerCreateForm from "@/components/PlayerCreateForm";
import PlayersAvatars from "@/components/PlayersAvatars";
import { STYLES } from "@/constants/styles";
import { pluralizePlayers } from "@/utils/pluralize";
import { Suspense, useState } from "react";

/**
 * @typedef Props
 * @property {import("@killer-game/types").GameRecord} game
 * @property {import("@killer-game/types").PlayerRecord[]} players
 * @property {(player: import("@killer-game/types").PlayerCreateDTO) => void} onPlayerCreate
 *
 * @param {Props} param0
 * @returns
 */
export default function GameDashboardSidebar({ game, onPlayerCreate, players }) {
  const [newPlayerModalOpen, setNewPlayerModalOpen] = useState();

  return (
    <>
      <div className="flex flex-col gap-4">
        <h2 className={STYLES.h2}> {pluralizePlayers(players.length)}</h2>
        <p>There is {pluralizePlayers(players.length)} in the game.</p>
        <Suspense fallback={<p>Loading players avatars</p>}>
          <PlayersAvatars players={players} />
        </Suspense>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className={STYLES.h2}>Invite more players</h2>
        {game.started_at ? (
          <p className="text-warning">The game started, you cannot invite new persons in the game.</p>
        ) : (
          <>
            <GameJoinLink game={game} />
            <p>Or you can also add players yourself and share his dashboard link later.</p>
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
      </div>
    </>
  );
}
