"use client";
import Fetching from "@/components/Fetching";
import { ToastContext, ToastProvider } from "@/context/Toast";
import { useGame } from "@/hooks/use-game";
import { useGameEvents } from "@/hooks/use-game-events";
import { useGamePlayers } from "@/hooks/use-game-players";
import { useGameToast } from "@/hooks/use-game-toast";
import { useNotifications } from "@/hooks/use-notifications";
import { usePlayer } from "@/hooks/use-player";
import { client } from "@/lib/client";
import { useCallback, useContext } from "react";
import PlayerDashboardGameStarted from "./PlayerDashboardGameStarted";
import PlayerDashboardGameUnStarted from "./PlayerDashboardGameUnStarted";

/**
 * @param {{player: import("@killer-game/types").PlayerRecord, game: import("@killer-game/types").GameRecordSanitized}} param0
 */
function PlayerDashboardContent({ player, game, setGame, setPlayer }) {
  const { notify } = useNotifications();
  const { push } = useContext(ToastContext);
  const gameToast = useGameToast(push);

  const onGameChange = useCallback(
    (gameUpdated) => {
      if (!game?.started_at && gameUpdated.started_at) {
        notify("🏁 The game started");
      } else if (game?.started_at && !gameUpdated.started_at) {
        notify("🎌 The game stopped");
      }
      setGame(gameUpdated);
    },
    [game, notify]
  );

  const {
    error: playersError,
    loading: playersLoading,
    players,
    addPlayer,
    deletePlayer,
    updatePlayer,
  } = useGamePlayers(player?.game_id);

  function onAddPlayer(player) {
    addPlayer(player);
    gameToast.player.created.success(player);
  }

  function onDeletePlayer(player) {
    deletePlayer(player);
    gameToast.player.removed.success(player);
  }

  useGameEvents(player?.game_id, {
    addPlayer: onAddPlayer,
    deletePlayer: onDeletePlayer,
    updatePlayer,
    setGame: onGameChange,
  });

  /**
   * @param {import("@killer-game/types").PlayerRecord} p
   */
  function onPlayerChange(p) {
    setPlayer(p);
    client
      .updatePlayer(p.game_id, p, playerPrivateToken)
      .then((r) => setPlayer(r))
      .catch((err) => setPlayer(player));
  }

  if (game.started_at) {
    return <PlayerDashboardGameStarted game={game} player={player} players={players} />;
  } else {
    return (
      <PlayerDashboardGameUnStarted game={game} player={player} players={players} onPlayerChange={onPlayerChange} />
    );
  }
}

/**
 * @param {{playerId: string, playerPrivateToken: string}} param0
 */
export default function PlayerDashboard({ playerId, playerPrivateToken }) {
  const { error: playerError, loading: playerLoading, player, setPlayer } = usePlayer(playerId, playerPrivateToken);
  const { error: gameError, loading: gameLoading, game, setGame } = useGame(player?.game_id);

  return (
    <Fetching error={playerError} loading={playerLoading}>
      <Fetching error={gameError} loading={gameLoading}>
        <ToastProvider>
          {Boolean(player && game) && (
            <PlayerDashboardContent game={game} player={player} setGame={setGame} setPlayer={setPlayer} />
          )}
        </ToastProvider>
      </Fetching>
    </Fetching>
  );
}
