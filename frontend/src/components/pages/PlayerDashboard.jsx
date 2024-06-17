"use client";
import { ToastContext, ToastProvider } from "@/context/Toast";
import { useGameEvents } from "@/hooks/use-game-events";
import { useGamePlayersList } from "@/hooks/use-game-players-list";
import { useGameToast } from "@/hooks/use-game-toast";
import { useNotifications } from "@/hooks/use-notifications";
import { client } from "@/lib/client";
import { useTranslations } from "next-intl";
import { useCallback, useContext, useState } from "react";
import PlayerDashboardGameFinished from "./PlayerDashboardGameFinished";
import PlayerDashboardGameStarted from "./PlayerDashboardGameStarted";
import PlayerDashboardGameUnStarted from "./PlayerDashboardGameUnStarted";

/**
 * @typedef PlayerDashboardContentProps
 * @property {(game: import("@killer-game/types").GameRecord) => void} setGame
 * @property {(game: import("@killer-game/types").PlayerRecord) => void} setPlayer
 * @property {import("@killer-game/types").PlayerRecord} player
 * @property {import("@killer-game/types").PlayerRecordSanitized[]} players
 * @property {import("@killer-game/types").GameRecordSanitized} game
 * @property {string} i18nGameHasStarted
 * @property {string} i18nGameHasStopped
 *
 * @param {PlayerDashboardContentProps} param0
 */
function PlayerDashboardContent({ player, game, setGame, setPlayer, ...props }) {
  const t = useTranslations();
  const { notify } = useNotifications();
  const { push } = useContext(ToastContext);
  const gameToast = useGameToast(push);

  const onGameChange = useCallback(
    /** @param {import("@killer-game/types").GameRecord} gameUpdated  */
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

  const { players, addPlayer, deletePlayer, updatePlayer } = useGamePlayersList(props.players);

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
 * @property {import("@killer-game/types").PlayerRecord} player
 * @property {import("@killer-game/types").PlayerRecordSanitized[]} players
 * @property {import("@killer-game/types").GameRecord} game
 *
 * @param {PlayerDashboardProps} props
 */
export default function PlayerDashboard(props) {
  const [player, setPlayer] = useState(props.player);
  const [game, setGame] = useState(props.game);

  return (
    <ToastProvider>
      <PlayerDashboardContent
        game={game}
        player={player}
        setGame={setGame}
        setPlayer={setPlayer}
        players={props.players}
      />
    </ToastProvider>
  );
}
