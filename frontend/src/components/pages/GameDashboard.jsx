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
import { pluralizePlayers } from "@/utils/pluralize";
import { Suspense, useCallback, useContext, useEffect } from "react";
import CardSection from "../atoms/CardSection";
import Fetching from "../molecules/Fetching";
import GameEvents from "../organisms/GameEvents";
import GamePodium from "../organisms/GamePodium";
import GameStartButton from "../organisms/GameStartButton";
import PlayersAvatars from "../organisms/PlayersAvatars";
import Unauthorized from "../organisms/Unauthorized";
import GameDashboardInvite from "./GameDashboardInvite";
import GameDashboardPlayers from "./GameDashboardPlayers";
import GameDashboardTimeline from "./GameDashboardTimeline";

/**
 * @typedef GameDashboardContentProps
 * @property {import("@killer-game/types").GameRecord} game
 * @property {(game: import("@killer-game/types").GameRecord) => void} setGame

 * @property {GameDashboardI18n} i18n
 *
 * @param {GameDashboardContentProps} param0
 * @returns
 */
export function GameDashboardContent({ game, setGame, i18n }) {
  const { push: pushToast } = useContext(ToastContext);
  const { notify } = useNotifications();

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

  return (
    <>
      <div className="mb-4 flex flex-col gap-2">
        <h1 className={STYLES.h1}>{game.name}</h1>

        <div className="flex gap-2">
          <Fetching loading={playersLoading} error={playersLoading}>
            {players && <PlayersAvatars className="flex-grow" players={players} />}
          </Fetching>
          <GameStartButton
            game={game}
            onChange={handleGameStartToggle}
            readonly={players?.length > 1}
            i18n={i18n.GameStartButton}
          />
        </div>
      </div>
      <div className="grid md:grid-cols-3 lg:grid-cols-2 xs:grid-cols-1 gap-4">
        <div className="flex flex-col gap-4">
          <GameDashboardInvite
            game={game}
            players={players}
            onPlayerCreate={handlePlayerCreate}
            i18n={{ ...i18n.GameDashboardInvite, PlayerCreateForm: i18n.PlayerCreateForm }}
          />

          {!!game.started_at && (
            <>
              <CardSection>
                <h2 className="card-title">{i18n.events}</h2>
                <Fetching error={dashboardError} loading={dashboardLoading}>
                  {!!dashboard && <GameEvents events={dashboard.events} />}
                </Fetching>
              </CardSection>

              <CardSection>
                <h2 className="card-title">{i18n.podium}</h2>
                <Fetching error={dashboardError} loading={dashboardLoading}>
                  {!!dashboard && <GamePodium podium={dashboard.podium} i18n={{ ...i18n.GamePodium }} />}
                </Fetching>
              </CardSection>
            </>
          )}
        </div>
        <div className="col-span-2 lg:col-span-1 flex flex-col gap-4">
          <CardSection>
            <h2 className="card-title">{pluralizePlayers(players.length)}</h2>
            <Suspense fallback={<p>Loading players avatars</p>}>
              <GameDashboardPlayers
                players={players}
                game={game}
                onPlayerDelete={handlePlayerDelete}
                onPlayerUpdate={handlePlayerUpdate}
              />
            </Suspense>
          </CardSection>
          <CardSection>
            <h2 className="card-title">{i18n.timeline}</h2>
            <GameDashboardTimeline
              players={players}
              game={game}
              onPlayerUpdate={handlePlayerUpdate}
              onPlayerDelete={handlePlayerDelete}
            />
          </CardSection>
        </div>
      </div>
    </>
  );
}

/**
 * @typedef GameDashboardI18n
 * @property {string} gameUrlNotValid
 * @property {string} timeline
 * @property {string} podium
 * @property {string} events
 * @property {import("../organisms/AvatarEditor").AvatarEditorI18n} AvatarEditor
 * @property {import("../organisms/GameStartButton").GameStartButtonI18n} GameStartButton
 * @property {import("./GameDashboardInvite").GameDashboardInviteI18n} GameDashboardInvite
 * @property {import("../organisms/GamePodium").GamePodiumI18n} GamePodium
 * @property {import("../molecules/PlayerStatusBadge").PlayerStatusBadgeI18n} PlayerStatusBadge
 * @property {import("../organisms/PlayerCreateForm").PlayerCreateFormI18n} PlayerCreateForm
 *
 *
 * @typedef Props
 * @property {string} gameId
 * @property {string} [gamePrivateToken]
 * @property {GameDashboardI18n} i18n
 *
 * @param {Props} param0
 */
export default function GameDashboard({ gameId, gamePrivateToken, i18n }) {
  const { error: gameError, loading: gameLoading, game, setGame } = useGame(gameId, gamePrivateToken);

  return (
    <ToastProvider>
      <Fetching loading={gameLoading} error={gameError}>
        {game?.private_token && <GameDashboardContent game={game} setGame={setGame} i18n={i18n} />}

        {Boolean(game && !game.private_token) && (
          <Unauthorized>
            <p>{i18n.gameUrlNotValid}</p>
          </Unauthorized>
        )}
      </Fetching>
    </ToastProvider>
  );
}
