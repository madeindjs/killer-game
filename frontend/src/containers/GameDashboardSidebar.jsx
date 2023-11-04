"use client";
import Fetching from "@/components/Fetching";
import GameEvents from "@/components/GameEvents";
import GameJoinLink from "@/components/GameJoinLink";
import GamePodium from "@/components/GamePodium";
import Modal from "@/components/Modal";
import PlayerCreateForm from "@/components/PlayerCreateForm";
import PlayersAvatars from "@/components/PlayersAvatars";
import { STYLES } from "@/constants/styles";
import { useGameDashboard } from "@/hooks/use-game-dashboard";
import { pluralizePlayers } from "@/utils/pluralize";
import { Suspense, useEffect, useState } from "react";

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

  const {
    dashboard,
    error: dashboardError,
    loading: dashboardLoading,
    load: loadDashboard,
  } = useGameDashboard(game.id, game.private_token);

  useEffect(loadDashboard, [game.id, game.private_token, players, loadDashboard]);

  return (
    <>
      <GameDashboardSidebarSection>
        <h2 className="card-title"> {pluralizePlayers(players.length)}</h2>
        <p>There is {pluralizePlayers(players.length)} in the game.</p>
        <Suspense fallback={<p>Loading players avatars</p>}>
          <PlayersAvatars players={players} />
        </Suspense>
      </GameDashboardSidebarSection>

      {!!game.started_at && (
        <>
          <GameDashboardSidebarSection>
            <h2 className="card-title">Events</h2>
            <Fetching error={dashboardError} loading={dashboardLoading}>
              {!!dashboard && <GameEvents events={dashboard.events} />}
            </Fetching>
          </GameDashboardSidebarSection>

          <GameDashboardSidebarSection>
            <h2 className="card-title">Podium</h2>
            <Fetching error={dashboardError} loading={dashboardLoading}>
              {!!dashboard && <GamePodium podium={dashboard.podium} />}
            </Fetching>
          </GameDashboardSidebarSection>
        </>
      )}

      <GameDashboardSidebarSection>
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
      </GameDashboardSidebarSection>
    </>
  );
}

function GameDashboardSidebarSection({ children }) {
  return (
    <div className="card bg-base-100 card-compact">
      <div className="card-body">{children}</div>
    </div>
  );
}
