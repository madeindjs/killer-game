"use client";
import { GameContext, GameProvider } from "@/context/Game";
import { PlayersContext, PlayersProvider } from "@/context/Players";
import { ToastContext, ToastProvider } from "@/context/Toast";

import { setupGameListener } from "@/lib/client";
import Link from "next/link";
import { useContext, useEffect } from "react";
import AlertError from "../components/AlertError";
import Loader from "../components/Loader";
import PlayerCreateForm from "../components/PlayerCreateForm";
import PlayersAvatars from "../components/PlayersAvatars";
import PlayersCards from "../components/PlayersCards";

function GameDashboardContent({ gameId, gamePrivateToken }) {
  const { game, loading: loadingGame } = useContext(GameContext);
  const {
    players,
    error,
    loading: loadingPlayers,
    apiCreatedPlayer,
    apiUpdatePlayer,
    apiDeletePlayer,
    createPlayer,
    updatePlayer,
    deletePlayer,
  } = useContext(PlayersContext);
  const { push: pushToast } = useContext(ToastContext);

  useEffect(
    () =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      setupGameListener(gameId, {
        onPlayerCreated: (player) => {
          createPlayer(player);
          pushToast("success", "One player was added");
        },
        onPlayerUpdated: updatePlayer,
        onPlayerDeleted: deletePlayer,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gameId]
  );

  if (error)
    return (
      <AlertError>
        Cannot load the game. Please go back to the&nbsp;
        <Link href="/" className="link">
          home page
        </Link>
      </AlertError>
    );

  if (loadingGame || !game) return <Loader />;

  return (
    <>
      <h1 className="text-3xl mb-3">{game.name}</h1>

      {loadingPlayers ? (
        <Loader />
      ) : (
        <>
          <div class="flex sticky top-0 relative z-10 backdrop-blur pt-2">
            <h2 className="text-2xl mb-1 flex-grow">
              Players <span className="badge badge-secondary">{players.length}</span>
            </h2>
            <div className="overflow-x-auto">
              <PlayersAvatars players={players} />
            </div>
          </div>
          <PlayersCards
            gameId={game.id}
            players={players}
            actions={game.actions}
            onPlayerUpdate={apiUpdatePlayer}
            onPlayerDelete={apiDeletePlayer}
          />
        </>
      )}
      <div className="card w-96 bg-base-300 shadow-xl">
        <div className="card-body">
          <p className="card-title">New player</p>
          <PlayerCreateForm onSubmit={apiCreatedPlayer} />
        </div>
      </div>
    </>
  );
}

/**
 * @param {{gameId: string, gamePrivateToken?: string}} param0
 * @returns
 */
export default function GameDashboard({ gameId, gamePrivateToken }) {
  return (
    <ToastProvider>
      <GameProvider gameId={gameId} gamePrivateToken={gamePrivateToken}>
        <PlayersProvider gameId={gameId} gamePrivateToken={gamePrivateToken}>
          <GameDashboardContent gameId={gameId} gamePrivateToken={gamePrivateToken} />
        </PlayersProvider>
      </GameProvider>
    </ToastProvider>
  );
}
