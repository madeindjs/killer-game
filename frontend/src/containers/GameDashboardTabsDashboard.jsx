"use client";
import AlertError from "@/components/AlertError";
import GamePodium from "@/components/GamePodium";
import Loader from "@/components/Loader";
import { useGameDashboard } from "@/hooks/use-game-dashboard";
import { useEffect } from "react";

/**
 * @typedef PlayersTableProps
 * @property {import("@killer-game/types").GameRecord} game
 * @property {import("@killer-game/types").PlayerRecord[]} players
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerUpdate]
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerDelete]
 *
 * @param {PlayersTableProps} param0
 */
export default function GameDashboardTabsDashboard({ game, players }) {
  const { error, loading, dashboard, load } = useGameDashboard(game.id, game.private_token);

  useEffect(load, [game.id, load, players]);

  return (
    <>
      {error && <AlertError>Could not load the dashboard</AlertError>}
      {dashboard && <GamePodium podium={dashboard.podium} />}
      {loading && <Loader />}
    </>
  );
}
