"use client";
import { GameContext, GameProvider } from "@/context/Game";
import { useContext } from "react";

function GameDashboardContent() {
  const { game, loading } = useContext(GameContext);

  if (loading || !game) return <p>Loading</p>;

  return (
    <>
      <h1>{game.name}</h1>
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
      <GameDashboardContent />
    </GameProvider>
  );
}
