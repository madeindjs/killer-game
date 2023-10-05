"use client";
import { GameContext, GameProvider } from "@/context/Game";
import { PlayersContext, PlayersProvider } from "@/context/Players";
import { ToastContext, ToastProvider } from "@/context/Toast";

import { useGameListener } from "@/lib/client";
import { useContext, useEffect } from "react";
import Loader from "./Loader";
import PlayerForm from "./PlayerForm";
import PlayersAvatars from "./PlayersAvatars";
import PlayersCards from "./PlayersCards";

function GameDashboardContent({ gameId, gamePrivateToken }) {
  const { game, loading: loadingGame } = useContext(GameContext);
  const { players, loading: loadingPlayers, addPlayer, createPlayer } = useContext(PlayersContext);
  const { push: pushToast } = useContext(ToastContext);

  useEffect(
    () =>
      useGameListener(gameId, {
        onPlayerCreated: (player) => {
          addPlayer(player);
          pushToast("success", "One player was added");
        },
      }),
    [gameId]
  );

  if (loadingGame || !game) return <Loader />;

  return (
    <>
      <h1 className="text-3xl mb-3">{game.name}</h1>
      <h2 className="text-2xl mb-1">
        Players <span className="badge badge-secondary">{players.length}</span>
      </h2>

      {loadingPlayers ? (
        <Loader />
      ) : (
        <>
          <PlayersAvatars players={players} />
          <PlayersCards gameId={game.id} players={players} actions={game.actions} />
        </>
      )}
      <div className="card w-96 bg-base-300 shadow-xl">
        <div className="card-body">
          <p className="card-title">New player</p>
          <PlayerForm onSubmit={createPlayer} />
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
