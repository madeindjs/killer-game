"use client";

import { STYLES } from "@/constants/styles";
import { ToastContext, ToastProvider } from "@/context/Toast";
import { useGameDashboard } from "@/hooks/use-game-dashboard";
import { useGameEvents } from "@/hooks/use-game-events";
import { useGamePlayersList } from "@/hooks/use-game-players-list";
import { useGameToast } from "@/hooks/use-game-toast";
import { useNotifications } from "@/hooks/use-notifications";
import { client } from "@/lib/client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Suspense, useCallback, useContext, useEffect, useState } from "react";
import HeroWithCard from "../atoms/HeroWithCard";
import AlertWarningUrlToken from "../molecules/AlertWarningUrlToken";
import CardSectionCollapse from "../molecules/CardSectionCollapse";
import Fetching from "../molecules/Fetching";
import { TimeSinceStartedCountDown } from "../molecules/TimeSinceStartedCountDown";
import GameEditButton from "../organisms/GameEditButton";
import GameEvents from "../organisms/GameEvents";
import GameJoinLink from "../organisms/GameJoinLink";
import GamePodium from "../organisms/GamePodium";
import GameStartButton from "../organisms/GameStartButton";
import PlayerCreateForm from "../organisms/PlayerCreateForm";
import PlayersAvatars from "../organisms/PlayersAvatars";
import GameDashboardInviteButton from "./GameDashboardInviteButton";
import GameDashboardPlayers from "./GameDashboardPlayers";
import GameDashboardTimeline from "./GameDashboardTimeline";

/** @import {GameRecord, PlayerRecord} from "@killer-game/types"  */

/**
 * @typedef GameDashboardContentProps
 * @property {GameRecord} game
 * @property {(game: GameRecord) => void} setGame
 * @property {PlayerRecord[]} players
 *
 *
 * @param {GameDashboardContentProps} param0
 * @returns
 */
export function GameDashboardContent({ game, setGame, ...props }) {
  const { push: pushToast } = useContext(ToastContext);
  const { notify } = useNotifications();
  const t = useTranslations("games");
  const tCommon = useTranslations("common");

  const { players, addPlayer, deletePlayer, updatePlayer, setPlayers } =
    useGamePlayersList(props.players);

  const {
    dashboard,
    error: dashboardError,
    loading: dashboardLoading,
    load: loadDashboard,
  } = useGameDashboard(game.id, game.private_token);

  useEffect(() => {
    loadDashboard();
  }, [game.id, game.private_token, players, loadDashboard]);

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
    [addPlayer, gameToast, notify],
  );

  useGameEvents(game.id, {
    addPlayer: onAddPlayer,
    deletePlayer,
    updatePlayer,
    setGame: onGameChange,
  });

  /** @param {GameRecord} newGame */
  function onGameChange(newGame) {
    setGame({
      ...newGame,
      private_token: game.private_token,
    });
  }

  /** @param {PlayerRecord} player */
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

  /** @param {PlayerRecord} player */
  function handlePlayerDelete(player) {
    client
      .deletePlayer(game.id, player.id, game.private_token)
      .then(() => {
        deletePlayer(player);
        gameToast.player.removed.success(player);
      })
      .catch(() => gameToast.player.removed.error(player));
  }

  /** @param {PlayerRecord} player */
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
    /** @type {GameRecord}  */
    const gameUpdate = {
      ...game,
      // @ts-expect-error use null to remove the field
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
        pushToast("error", "🔥 An error occurred, the game was not updated.");
      });
  }

  /** @param {GameRecord} gameUpdate */
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

  if (players?.length === 0) {
    return (
      <HeroWithCard
        side={
          <>
            <h2 className={STYLES.h2}>
              ✨ {t("GameDashboardContent.noPlayers.welcome")}&nbsp;
              <strong className="text-primary">{game.name}</strong>
            </h2>
            <p className="mb-4">
              {t("GameDashboardContent.noPlayers.headline")}
            </p>
            <AlertWarningUrlToken />
            <div className="divider"></div>
            <h3 className={STYLES.h3}>
              {t("GameDashboardContent.noPlayers.addPlayer")}
            </h3>

            <p>{t("GameDashboardInvite.linkDescription")}</p>
            <GameJoinLink game={game} />
          </>
        }
        card={
          <>
            <PlayerCreateForm
              defaultName="Alexandre"
              onSubmit={handlePlayerCreate}
              allowChangeAction={true}
            />
          </>
        }
      />
    );
  }

  async function reloadPlayers() {
    const newPlayers = await client.fetchPlayers(game.id, game.private_token);
    setPlayers(newPlayers);
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex">
          <h1 className={STYLES.h1 + " flex-grow"}>{game.name}</h1>
          {game.started_at && (
            <div className="flex items-center">
              <TimeSinceStartedCountDown
                startedAt={game.started_at}
                stop={game.finished_at}
                className={game.finished_at ? "text-success" : ""}
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="overflow-x-auto flex-grow">
            {players && (
              <PlayersAvatars className="flex-grow" players={players} />
            )}
          </div>

          <div className="flex flex-wrap gap-2">
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
            <GameStartButton
              game={game}
              players={players}
              onChange={handleGameStartToggle}
              disabled={players?.length < 2 || !!game.finished_at}
            />
          </div>
        </div>
      </div>
      <div className="grid xs:grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-4 w-full">
          <CardSectionCollapse
            className="w-full"
            title={tCommon("count.player", { count: players.length })}
            open={!game.started_at && players?.length > 0}
          >
            <Suspense fallback={<p>Loading players avatars</p>}>
              <GameDashboardPlayers
                players={players}
                game={game}
                onPlayerDelete={handlePlayerDelete}
                onPlayerUpdate={handlePlayerUpdate}
                reload={reloadPlayers}
              />
            </Suspense>
          </CardSectionCollapse>
          {!!game.started_at && (
            <CardSectionCollapse title={tCommon("dashboard.podium")} open>
              <Fetching error={dashboardError} loading={dashboardLoading}>
                {!!dashboard && <GamePodium podium={dashboard.podium} />}
              </Fetching>
            </CardSectionCollapse>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <CardSectionCollapse title={tCommon("dashboard.timeline")} open>
            <GameDashboardTimeline
              players={players}
              game={game}
              onPlayerUpdate={handlePlayerUpdate}
              onPlayerDelete={handlePlayerDelete}
            />
          </CardSectionCollapse>
          {!!game.started_at && (
            <CardSectionCollapse title={tCommon("dashboard.events")} open>
              <Fetching error={dashboardError} loading={dashboardLoading}>
                {!!dashboard && <GameEvents events={dashboard.events} />}
              </Fetching>
            </CardSectionCollapse>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * @typedef GameDashboardProps
 * @property {import("@killer-game/types").GameRecord} game
 * @property {import("@killer-game/types").PlayerRecord[]} players
 *
 * @param {GameDashboardProps} props
 */
export default function GameDashboard(props) {
  const [game, setGame] = useState(props.game);

  return (
    <ToastProvider>
      <GameDashboardContent
        game={game}
        setGame={setGame}
        players={props.players}
      />
    </ToastProvider>
  );
}
