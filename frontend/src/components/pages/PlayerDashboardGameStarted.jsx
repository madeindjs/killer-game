"use client";
import { STYLES } from "@/constants/styles";
import { useGameDashboard } from "@/hooks/use-game-dashboard";
import { usePlayerStatus } from "@/hooks/use-player-status";
import useTranslation from "next-translate/useTranslation";
import { useEffect } from "react";
import CardSection from "../atoms/CardSection";
import HeroWithCard from "../atoms/HeroWithCard";
import Token from "../atoms/Token";
import Fetching from "../molecules/Fetching";
import PlayerAvatar from "../molecules/PlayerAvatar";
import { TimeSinceStartedCountDown } from "../molecules/TimeSinceStartedCountDown";
import GameEvents from "../organisms/GameEvents";
import GamePodium from "../organisms/GamePodium";
import KillCardForm from "./KillCardForm";

/**
 * @typedef HeroContentAliveProps
 * @property {import("@killer-game/types").PlayerRecordSanitized} currentTarget
 * @property {import("@killer-game/types").PlayerRecord} player
 * @property {import("@killer-game/types").GameActionRecord} action
 *
 * @param {HeroContentAliveProps} param0
 */
function HeroContentAlive({ currentTarget, currentAction, player }) {
  const { t } = useTranslation("player-dashboard");
  return (
    <>
      <h2 className={STYLES.h1}>{t("PlayerDashboardGameStartedKillCard.yourCurrentMission")}</h2>
      <p>
        {t("PlayerDashboardGameStartedKillCard.youNeedToKill")}{" "}
        <strong className="text-primary">{currentTarget?.name}</strong>
        .&nbsp;{t("PlayerDashboardGameStartedKillCard.youNeedToMakeHimDo")}&nbsp;
        <strong className="text-primary">{currentAction?.name}</strong>
      </p>
      <p className="mb-4">{t("PlayerDashboardGameStartedKillCard.onceDone")}</p>
      <div className="divider"></div>
      <h2 className={STYLES.h2}>{t("PlayerDashboardGameStartedKillCard.youGetKilled")}</h2>
      <p className="mb-2">
        {t("PlayerDashboardGameStartedKillCard.communicateYourKilledToken")}: <Token token={player.kill_token} />
      </p>
    </>
  );
}

function HeroContentDead() {
  const { t } = useTranslation("player-dashboard");
  return (
    <>
      <h2 className={STYLES.h1}>Oh no! You were killed!</h2>
      <p className="mb-2">You can still enjoy the game and help other players to accomplish their mission.</p>
      <p>But you cannot kill anyone anymore.</p>
    </>
  );
}

/**
 * @typedef Props
 * @property {import("@killer-game/types").PlayerRecord} player
 * @property {import("@killer-game/types").GameRecordSanitized} game
 * @property {import("@killer-game/types").PlayerRecordSanitized[]} players
 *
 * @param {{player: import("@killer-game/types").PlayerRecord, game: import("@killer-game/types").GameRecord}} param0
 */
export default function PlayerDashboardGameStarted({ player, game, players }) {
  const { t } = useTranslation("player-dashboard");
  const { t: tCommon } = useTranslation("common");
  const { playerStatusError, playerStatusLoading, playerStatus, load } = usePlayerStatus(
    player.id,
    player.private_token
  );

  const {
    dashboard,
    error: dashboardError,
    load: loadDashboard,
    loading: dashboardLoading,
  } = useGameDashboard(game.id, player.private_token);

  useEffect(() => {
    loadDashboard();
  }, [players, loadDashboard]);

  const currentTarget = playerStatus?.current.player;
  const currentAction = playerStatus?.current.action;

  return (
    <div>
      <div className="flex mb-4">
        <h1 className={STYLES.h1 + " flex-grow"}>
          {t("PlayerDashboardGameStarted.dear", { player: player?.name ?? "" })}
        </h1>
        <div className="flex items-center">
          <TimeSinceStartedCountDown startedAt={game.started_at} />
        </div>
      </div>

      <Fetching loading={playerStatusLoading} error={playerStatusError}>
        {playerStatus && (
          <HeroWithCard
            className="min-h-[80vh]"
            card={
              <>
                <div className="flex gap-4 mb-3">
                  <PlayerAvatar player={currentTarget} />
                  <div>
                    <div className="flex flex-col gap-3">
                      <p className={STYLES.h2}>{currentTarget?.name}</p>
                      <p>🎯: {currentAction?.name}</p>
                    </div>
                  </div>
                </div>
                <KillCardForm
                  playerId={player.id}
                  privateToken={player.private_token}
                  targetId={currentTarget.id}
                  onKill={load}
                  disabled={!!player.killed_at}
                />
              </>
            }
            side={
              player.killed_at ? (
                <HeroContentDead />
              ) : (
                <HeroContentAlive currentAction={currentAction} currentTarget={currentTarget} player={player} />
              )
            }
          />
        )}
      </Fetching>

      <div className="grid md:grid-cols-2 xs:grid-cols-1 gap-4">
        <div className="flex gap-4 flex-col">
          <CardSection>
            <h2 className="card-title">{tCommon("dashboard.podium")}</h2>
            <Fetching loading={dashboardLoading} error={dashboardError}>
              {dashboard && <GamePodium podium={dashboard.podium} />}
            </Fetching>
          </CardSection>
        </div>
        <div className="flex gap-4 flex-col">
          <CardSection>
            <h2 className="card-title">{tCommon("dashboard.events")}</h2>
            <Fetching loading={dashboardLoading} error={dashboardError}>
              {dashboard && <GameEvents events={dashboard.events} />}
            </Fetching>
          </CardSection>
        </div>
      </div>
    </div>
  );
}
