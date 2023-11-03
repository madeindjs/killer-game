"use client";

import { client } from "@/lib/client";

import Fetching from "@/components/Fetching";
import GameStartButton from "@/components/GameStartButton";
import { STYLES } from "@/constants/styles";
import { useGame } from "@/hooks/use-game";
import { useGameDashboard } from "@/hooks/use-game-dashboard";
import { useGameEvents } from "@/hooks/use-game-events";
import { useGamePlayers } from "@/hooks/use-game-players";
import { useNotifications } from "@/hooks/use-notifications";
import { useCallback, useEffect } from "react";
import GameDashboardSidebar from "./GameDashboardSidebar";
import GameDashboardTabs from "./GameDashboardTabs";

/**
 * @param {{gameId: string, gamePrivateToken?: string}} param0
 * @returns
 */
export default function GameDashboard({ gameId, gamePrivateToken }) {
  const { notify } = useNotifications();

  const { error: gameError, loading: gameLoading, game, setGame } = useGame(gameId, gamePrivateToken);
  const { players, addPlayer, deletePlayer, updatePlayer } = useGamePlayers(gameId, gamePrivateToken);

  const onAddPlayer = useCallback(
    (player) => {
      notify("🏁 The game started");
      addPlayer(player);
    },
    [addPlayer, notify]
  );

  useGameEvents(gameId, { onAddPlayer, deletePlayer, updatePlayer, setGame });

  const {
    dashboard,
    error: dashboardError,
    loading: dashboardLoading,
    load: loadDashboard,
  } = useGameDashboard(gameId, gamePrivateToken);

  useEffect(loadDashboard, [gameId, gamePrivateToken, players, loadDashboard]);

  function handlePlayerUpdate(player) {
    const oldPlayer = players.find((p) => p.id === player.id);
    updatePlayer(player);
    client.updatePlayer(gameId, player, gamePrivateToken).catch(() => updatePlayer(oldPlayer));
  }

  function handlePlayerDelete(player) {
    client.deletePlayer(gameId, player.id, gamePrivateToken).then(() => deletePlayer(player));
  }

  function handlePlayerCreate(player) {
    client.createPlayer(gameId, player).then(addPlayer);
  }

  function handleGameStartToggle() {
    const gameUpdate = {
      ...game,
      started_at: game.started_at ? null : new Date().toISOString(),
    };

    setGame(gameUpdate);
    client
      .updateGame(gameUpdate)
      .then(setGame)
      .catch(() => setGame(game));
  }

  return (
    <Fetching loading={gameLoading} error={gameError}>
      {game && (
        <>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <h1 className={`${STYLES.h1} flex-grow`}>{game.name}</h1>
            <GameStartButton game={game} onChange={handleGameStartToggle} readonly={players?.length > 1} />
          </div>
          <div className="grid md:grid-cols-3 xs:grid-cols-1 gap-12">
            <div className="col-span-2">
              <GameDashboardTabs
                game={game}
                onPlayerDelete={handlePlayerDelete}
                onPlayerUpdate={handlePlayerUpdate}
                players={players}
                podium={dashboard?.podium}
              />
            </div>
            <div className="flex flex-col gap-12">
              <GameDashboardSidebar
                game={game}
                players={players}
                onPlayerCreate={handlePlayerCreate}
                events={dashboard?.events ?? []}
              />
            </div>
          </div>
        </>
      )}
    </Fetching>
  );
}
