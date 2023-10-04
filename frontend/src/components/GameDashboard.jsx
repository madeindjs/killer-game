"use client";
import { GameContext, GameProvider } from "@/context/Game";
import { PlayersContext, PlayersProvider } from "@/context/Players";

import { useGameListener } from "@/lib/client";
import { useContext, useEffect } from "react";
import PlayerForm from "./PlayerForm";
import PlayersTable from "./PlayersTable";

function GameDashboardContent({ gameId, gamePrivateToken }) {
  const { game, loading: loadingGame } = useContext(GameContext);
  const { players, loading: loadingPlayers, addPlayer, updatePlayers, createPlayer } = useContext(PlayersContext);

  /**
   * @param {Player} player
   */
  function onPlayerCreated(player) {
    addPlayer(player);
  }

  useEffect(() => useGameListener(gameId, { onPlayerCreated }), [gameId]);

  if (loadingGame || !game) return <p>Loading</p>;

  return (
    <>
      <h1>{game.name}</h1>
      <h2>Players</h2>
      <PlayersTable gameId={game.id} players={players} />
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
    <GameProvider gameId={gameId} gamePrivateToken={gamePrivateToken}>
      <PlayersProvider gameId={gameId} gamePrivateToken={gamePrivateToken}>
        <GameDashboardContent gameId={gameId} gamePrivateToken={gamePrivateToken} />
      </PlayersProvider>
    </GameProvider>
  );
}
