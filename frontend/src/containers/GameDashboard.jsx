"use client";

import { client } from "@/lib/client";

import Fetching from "@/components/Fetching";
import GameStartButton from "@/components/GameStartButton";
import { STYLES } from "@/constants/styles";
import { ToastContext, ToastProvider } from "@/context/Toast";
import { useGame } from "@/hooks/use-game";
import { useGameEvents } from "@/hooks/use-game-events";
import { useGamePlayers } from "@/hooks/use-game-players";
import { useNotifications } from "@/hooks/use-notifications";
import { useCallback, useContext } from "react";
import GameDashboardSidebar from "./GameDashboardSidebar";
import GameDashboardTabs from "./GameDashboardTabs";

/**
 * @param {{game: import("@killer-game/types").GameRecord, setGame: any}} param0
 * @returns
 */
export function GameDashboardContent({ game, setGame }) {
  const { push: pushToast } = useContext(ToastContext);
  const { notify } = useNotifications();

  const { players, addPlayer, deletePlayer, updatePlayer } = useGamePlayers(game.id, game.privateToken);

  const onAddPlayer = useCallback(
    (player) => {
      addPlayer(player).then((res) => {
        if (res) {
          const msg = `👯 ${player.name} joined the game`;
          pushToast("success", msg);
          notify(msg);
        }
      });
    },
    [addPlayer, pushToast, notify]
  );

  useGameEvents(game.id, { addPlayer: onAddPlayer, deletePlayer, updatePlayer, setGame });

  function handlePlayerUpdate(player) {
    const oldPlayer = players.find((p) => p.id === player.id);
    updatePlayer(player);
    client
      .updatePlayer(game.id, player, game.private_token)
      .then(() => pushToast("success", "✅ The player was updated."))
      .catch(() => {
        updatePlayer(oldPlayer);
        pushToast("error", "🔥 An error occurred, the player was not updated.");
      });
  }

  function handlePlayerDelete(player) {
    client
      .deletePlayer(game.id, player.id, game.private_token)
      .then(() => {
        deletePlayer(player);
        pushToast("success", "✅ The player was removed.");
      })
      .catch(() => {
        pushToast("error", "🔥 An error occurred, the player was not removed.");
      });
  }

  function handlePlayerCreate(player) {
    client
      .createPlayer(game.id, player)
      .then((p) => {
        addPlayer(p);
        pushToast("success", "✅ The player was added to the game.");
      })
      .catch(() => {
        pushToast("error", "🔥 An error occurred, the player was not created.");
      });
  }

  function handleGameStartToggle() {
    const gameUpdate = {
      ...game,
      started_at: game.started_at ? null : new Date().toISOString(),
    };

    setGame(gameUpdate);
    client
      .updateGame(gameUpdate)
      .then((g) => {
        setGame(g);
        if (g.started_at) {
          pushToast("success", "🏁 The game was started.");
        } else {
          pushToast("success", "🎌 The game was paused.");
        }
      })
      .catch(() => {
        setGame(game);
        pushToast("error", "🔥 An error occurred, the player was not removed.");
      });
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <h1 className={`${STYLES.h1} flex-grow`}>{game.name}</h1>
        <GameStartButton game={game} onChange={handleGameStartToggle} readonly={players?.length > 1} />
      </div>
      <div className="grid md:grid-cols-3 lg:grid-cols-2 xs:grid-cols-1 gap-6">
        <div className="col-span-2 lg:col-span-1">
          <div className={STYLES.sectionCard}>
            <GameDashboardTabs
              game={game}
              onPlayerDelete={handlePlayerDelete}
              onPlayerUpdate={handlePlayerUpdate}
              players={players}
            />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <GameDashboardSidebar game={game} players={players} onPlayerCreate={handlePlayerCreate} />
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
  const { error: gameError, loading: gameLoading, game, setGame } = useGame(gameId, gamePrivateToken);

  return (
    <ToastProvider>
      <Fetching loading={gameLoading} error={gameError}>
        {game && <GameDashboardContent game={game} setGame={setGame} />}
      </Fetching>
    </ToastProvider>
  );
}
