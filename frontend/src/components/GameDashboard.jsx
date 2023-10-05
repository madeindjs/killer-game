"use client";
import { GameContext, GameProvider } from "@/context/Game";
import { PlayersContext, PlayersProvider } from "@/context/Players";
import { ToastContext, ToastProvider } from "@/context/Toast";

import { useGameListener } from "@/lib/client";
import { useContext, useEffect } from "react";
import Loader from "./Loader";
import PlayerForm from "./PlayerForm";
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
        Players <span class="badge badge-secondary">{players.length}</span>
      </h2>
      <div class="collapse bg-base-200">
        <input type="checkbox" class="peer" />
        <div class="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
          Add a player
        </div>
        <div class="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
          <PlayerForm onSubmit={createPlayer} />
        </div>
      </div>
      {loadingPlayers ? <Loader /> : <PlayersCards gameId={game.id} players={players} />}
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
