"use client";
import { GameContext, GameProvider } from "@/context/Game";
import { PlayersContext, PlayersProvider } from "@/context/Players";
import { ToastContext, ToastProvider } from "@/context/Toast";

import { useGameListener } from "@/lib/client";
import { useContext, useEffect } from "react";
import Loader from "./Loader";
import PlayerForm from "./PlayerForm";
import PlayersTable from "./PlayersTable";

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
      <h1>{game.name}</h1>
      <h2>Players</h2>
      {loadingPlayers ? <Loader /> : <PlayersTable gameId={game.id} players={players} />}
      <h3>New player</h3>
      <PlayerForm onSubmit={createPlayer} />
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
