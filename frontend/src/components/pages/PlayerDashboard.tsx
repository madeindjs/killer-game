"use client";
import { ToastContext, ToastProvider } from "@/context/Toast";
import { useGameEvents } from "@/hooks/use-game-events";
import { useGamePlayersList } from "@/hooks/use-game-players-list";
import { useGameToast } from "@/hooks/use-game-toast";
import { useNotifications } from "@/hooks/use-notifications";
import { client } from "@/lib/client";
import { useTranslations } from "next-intl";
import { useCallback, useContext, useEffect, useState } from "react";
import PlayerDashboardGameFinished from "./PlayerDashboardGameFinished";
import PlayerDashboardGameStarted from "./PlayerDashboardGameStarted";
import PlayerDashboardGameUnStarted from "./PlayerDashboardGameUnStarted";
import type { GameRecord, GameRecordSanitized, PlayerRecord, PlayerRecordSanitized } from "@killer-game/types";

interface PlayerDashboardContentProps {
  setGame: (game: GameRecord) => void;
  setPlayer: (player: PlayerRecord) => void;
  player: PlayerRecord;
  players: PlayerRecordSanitized[];
  game: GameRecord;
}

function PlayerDashboardContent({ player, game, setGame, setPlayer, ...props }: PlayerDashboardContentProps) {
  const t = useTranslations();
  const { notify } = useNotifications();
  const { push } = useContext(ToastContext);
  const gameToast = useGameToast(push);

  const onGameChange = useCallback(
    (gameUpdated: GameRecordSanitized) => {
      if (!game?.started_at && gameUpdated.started_at) {
        notify(`🏁 ${t("common.gameHasStarted")}`);
      } else if (game?.started_at && !gameUpdated.started_at) {
        notify(`🎌 ${t("common.gameHasStopped")}`);
      }
      setGame(gameUpdated as GameRecord);
    },
    [game, notify],
  );

  const { players, addPlayer, deletePlayer, updatePlayer } = useGamePlayersList(props.players);

  function onAddPlayer(player: PlayerRecordSanitized) {
    addPlayer(player);
    gameToast.player.created.success(player);
  }

  function onDeletePlayer(player: PlayerRecordSanitized) {
    deletePlayer(player);
    gameToast.player.removed.success(player);
  }

  function onUpdatePlayer(p: PlayerRecordSanitized) {
    if (p.id === player.id) {
      client.fetchPlayer(player.id, player.private_token).then(setPlayer).catch(console.error);
    }
    updatePlayer(p);
  }

  useGameEvents(
    player?.game_id,
    {
      addPlayer: onAddPlayer,
      deletePlayer: onDeletePlayer,
      updatePlayer: onUpdatePlayer,
      setGame: onGameChange,
    },
    // identify the player so the organizer sees them as connected
    { player },
  );

  function onPlayerChange(p: PlayerRecord) {
    setPlayer(p);
    client
      .updatePlayer(p.game_id, p, player.private_token)
      .then((r: PlayerRecord) => setPlayer(r))
      .catch(() => setPlayer(player));
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

interface PlayerDashboardProps {
  player: PlayerRecord;
  players: PlayerRecordSanitized[];
  game: GameRecord;
}

export default function PlayerDashboard(props: PlayerDashboardProps) {
  const [player, setPlayer] = useState(props.player);
  const [game, setGame] = useState(props.game);

  async function refresh() {
    if (document.visibilityState !== "visible") return;

    try {
      const newGame = await client.fetchGame(game.id, game.private_token);
      if (JSON.stringify(game) !== JSON.stringify(newGame)) setGame(newGame);
    } catch {}

    try {
      const newPlayer = await client.fetchPlayer(player.id, player.private_token);
      if (JSON.stringify(player) !== JSON.stringify(newPlayer)) setPlayer(newPlayer);
    } catch {}
  }

  useEffect(() => {
    document.addEventListener("visibilitychange", refresh);
    return () => document.removeEventListener("visibilitychange", refresh);
  });

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
