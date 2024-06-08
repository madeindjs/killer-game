"use client";
import { ToastContext, ToastProvider } from "@/context/Toast";
import { useGame } from "@/hooks/use-game";
import { useGameEvents } from "@/hooks/use-game-events";
import { useGamePlayers } from "@/hooks/use-game-players";
import { useGameToast } from "@/hooks/use-game-toast";
import { useGamesJoined } from "@/hooks/use-games-joined";
import { useNotifications } from "@/hooks/use-notifications";
import { usePlayer } from "@/hooks/use-player";
import { client } from "@/lib/client";
import useTranslation from "next-translate/useTranslation";
import { useCallback, useContext, useEffect } from "react";
import Fetching from "../molecules/Fetching";
import Unauthorized from "../organisms/Unauthorized";
import PlayerDashboardGameFinished from "./PlayerDashboardGameFinished";
import PlayerDashboardGameStarted from "./PlayerDashboardGameStarted";
import PlayerDashboardGameUnStarted from "./PlayerDashboardGameUnStarted";

/**
 * @typedef PlayerDashboardContentProps
 * @property {import("@killer-game/types").PlayerRecord} player
 * @property {import("@killer-game/types").GameRecordSanitized} game
 * @property {string} i18nGameHasStarted
 * @property {string} i18nGameHasStopped
 *
 * @param {PlayerDashboardContentProps} param0
 */
function PlayerDashboardContent({ player, game, setGame, setPlayer }) {
  const { t } = useTranslation();
  const { notify } = useNotifications();
  const { push } = useContext(ToastContext);
  const gameToast = useGameToast(push);

  const { addGame } = useGamesJoined();

  useEffect(() => {
    addGame({ ...game, player });
  }, [game, addGame, player]);

  const onGameChange = useCallback(
    (gameUpdated) => {
      if (!game?.started_at && gameUpdated.started_at) {
        notify(`🏁 ${t("gameHasStarted")}`);
      } else if (game?.started_at && !gameUpdated.started_at) {
        notify(`🎌 ${t("gameHasStopped")}`);
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
      .updatePlayer(p.game_id, p, player.private_token)
      .then((r) => setPlayer(r))
      .catch((err) => setPlayer(player));
  }

  if (game.finished_at) {
    return <PlayerDashboardGameFinished game={game} player={player} players={players} />;
  } else if (game.started_at) {
    return <PlayerDashboardGameStarted game={game} player={player} players={players} />;
  } else {
    return (
      <PlayerDashboardGameUnStarted game={game} player={player} players={players} onPlayerChange={onPlayerChange} />
    );
  }
}

/**
 * @typedef PlayerDashboardProps
 *
 * @param {PlayerDashboardProps} param0
 */
export default function PlayerDashboard({ playerId, playerPrivateToken }) {
  const { error: playerError, loading: playerLoading, player, setPlayer } = usePlayer(playerId, playerPrivateToken);
  const { error: gameError, loading: gameLoading, game, setGame } = useGame(player?.game_id);

  return (
    <Fetching error={playerError} loading={playerLoading}>
      <Fetching error={gameError} loading={gameLoading}>
        <ToastProvider>
          {Boolean(player && !player?.private_token) && (
            <Unauthorized>
              <p>{i18nGameUrlNotValid}</p>
            </Unauthorized>
          )}
          {Boolean(player && player.private_token && game) && (
            <PlayerDashboardContent game={game} player={player} setGame={setGame} setPlayer={setPlayer} />
          )}
        </ToastProvider>
      </Fetching>
    </Fetching>
  );
}
