"use client";

import { STYLES } from "@/constants/styles";
import { ToastContext, ToastProvider } from "@/context/Toast";
import { useGame } from "@/hooks/use-game";
import { useGameDashboard } from "@/hooks/use-game-dashboard";
import { useGameEvents } from "@/hooks/use-game-events";
import { useGamePlayers } from "@/hooks/use-game-players";
import { useGameToast } from "@/hooks/use-game-toast";
import { useNotifications } from "@/hooks/use-notifications";
import { client } from "@/lib/client";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { Suspense, useCallback, useContext, useEffect } from "react";
import CardSection from "../atoms/CardSection";
import Fetching from "../molecules/Fetching";
import { TimeSinceStartedCountDown } from "../molecules/TimeSinceStartedCountDown";
import GameEditButton from "../organisms/GameEditButton";
import GameEvents from "../organisms/GameEvents";
import GamePodium from "../organisms/GamePodium";
import GameStartButton from "../organisms/GameStartButton";
import PlayersAvatars from "../organisms/PlayersAvatars";
import Unauthorized from "../organisms/Unauthorized";
import GameDashboardInviteButton from "./GameDashboardInviteButton";
import GameDashboardPlayers from "./GameDashboardPlayers";
import GameDashboardTimeline from "./GameDashboardTimeline";

/**
 * @typedef GameDashboardContentProps
 * @property {import("@killer-game/types").GameRecord} game
 * @property {(game: import("@killer-game/types").GameRecord) => void} setGame
 *
 *
 * @param {GameDashboardContentProps} param0
 * @returns
 */
export function GameDashboardContent({ game, setGame }) {
  const { push: pushToast } = useContext(ToastContext);
  const { notify } = useNotifications();
  const { t } = useTranslation("games");
  const { t: tCommon } = useTranslation("common");

  const {
    players,
    addPlayer,
    deletePlayer,
    updatePlayer,
    error: playersError,
    loading: playersLoading,
  } = useGamePlayers(game.id, game.private_token);

  const {
    dashboard,
    error: dashboardError,
    loading: dashboardLoading,
    load: loadDashboard,
  } = useGameDashboard(game.id, game.private_token);

  useEffect(loadDashboard, [game.id, game.private_token, players, loadDashboard]);

  const gameToast = useGameToast(pushToast);

  const onAddPlayer = useCallback(
    (player) => {
      addPlayer(player).then((res) => {
        if (res) {
          const msg = `👯 ${player.name} joined the game`;
          gameToast.player.created.success(player);
          notify(msg);
        }
      });
    },
    [addPlayer, gameToast, notify]
  );

  useGameEvents(game.id, { addPlayer: onAddPlayer, deletePlayer, updatePlayer, setGame });

  function handlePlayerUpdate(player) {
    const oldPlayer = players.find((p) => p.id === player.id);
    updatePlayer(player);
    client
      .updatePlayer(game.id, player, game.private_token)
      .then(gameToast.player.updated.success)
      .catch(() => {
        updatePlayer(oldPlayer);
        gameToast.player.updated.error(player);
      });
  }

  function handlePlayerDelete(player) {
    client
      .deletePlayer(game.id, player.id, game.private_token)
      .then(() => {
        deletePlayer(player);
        gameToast.player.removed.success(player);
      })
      .catch(() => gameToast.player.removed.error(player));
  }

  function handlePlayerCreate(player) {
    client
      .createPlayer(game.id, player)
      .then((p) => {
        addPlayer(p);
        gameToast.player.created.success(p);
        pushToast("success", "✅ The player was added to the game.");
      })
      .catch(gameToast.player.created.error);
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

  function handleGameUpdate(gameUpdate) {
    setGame(gameUpdate);
    client
      .updateGame(gameUpdate)
      .then(setGame)
      .catch(() => {
        setGame(game);
        pushToast("error", "🔥 An error occurred, the player was not removed.");
      });
  }

  const router = useRouter();

  function handleGameDelete() {
    client
      .deleteGame(game)
      .then(() => router.push("/"))
      .catch(() => {
        setGame(game);
        pushToast("error", "🔥 An error occurred, the player was not removed.");
      });
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex">
          <h1 className={STYLES.h1 + " flex-grow"}>{game.name}</h1>
          {game.started_at && (
            <div className="flex items-center">
              <TimeSinceStartedCountDown startedAt={game.started_at} />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Fetching loading={playersLoading} error={playersLoading}>
            <div className="overflow-x-auto">
              {players && <PlayersAvatars className="flex-grow" players={players} />}
            </div>
          </Fetching>

          <GameDashboardInviteButton
            game={game}
            players={players}
            onPlayerCreate={handlePlayerCreate}
            disabled={!!game.started_at}
          />
          <GameEditButton
            game={game}
            onGameUpdate={handleGameUpdate}
            onGameDelete={handleGameDelete}
            disabled={!!game.started_at}
          />
          <GameStartButton game={game} onChange={handleGameStartToggle} disabled={players?.length < 2} />
        </div>
      </div>
      <div className="grid xs:grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-4 w-full">
          <CardSection className="w-full">
            <h2 className="card-title">{tCommon("count.player", { count: players.length })}</h2>
            <Suspense fallback={<p>Loading players avatars</p>}>
              <GameDashboardPlayers
                players={players}
                game={game}
                onPlayerDelete={handlePlayerDelete}
                onPlayerUpdate={handlePlayerUpdate}
              />
            </Suspense>
          </CardSection>
          {!!game.started_at && (
            <CardSection>
              <h2 className="card-title">{tCommon("dashboard.podium")}</h2>
              <Fetching error={dashboardError} loading={dashboardLoading}>
                {!!dashboard && <GamePodium podium={dashboard.podium} />}
              </Fetching>
            </CardSection>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <CardSection>
            <h2 className="card-title">{tCommon("dashboard.timeline")}</h2>
            <GameDashboardTimeline
              players={players}
              game={game}
              onPlayerUpdate={handlePlayerUpdate}
              onPlayerDelete={handlePlayerDelete}
            />
          </CardSection>
          {!!game.started_at && (
            <CardSection>
              <h2 className="card-title">{tCommon("dashboard.events")}</h2>
              <Fetching error={dashboardError} loading={dashboardLoading}>
                {!!dashboard && <GameEvents events={dashboard.events} />}
              </Fetching>
            </CardSection>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * @typedef GameDashboardProps
 * @property {string} gameId
 * @property {string} [gamePrivateToken]
 *
 * @param {GameDashboardProps} param0
 */
export default function GameDashboard({ gameId, gamePrivateToken }) {
  const { error: gameError, loading: gameLoading, game, setGame } = useGame(gameId, gamePrivateToken);
  const { t } = useTranslation();

  return (
    <ToastProvider>
      <Fetching loading={gameLoading} error={gameError}>
        {game?.private_token && <GameDashboardContent game={game} setGame={setGame} />}

        {Boolean(game && !game.private_token) && (
          <Unauthorized>
            <p>{t("gameUrlNotValid")}</p>
          </Unauthorized>
        )}
      </Fetching>
    </ToastProvider>
  );
}
