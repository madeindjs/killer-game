"use client";
import { STYLES } from "@/constants/styles";
import { useGameDashboard } from "@/hooks/use-game-dashboard";
import { usePlayerStatus } from "@/hooks/use-player-status";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import CardSection from "../atoms/CardSection";
import HeroWithCard from "../atoms/HeroWithCard";
import Fetching from "../molecules/Fetching";
import PlayerAvatar from "../molecules/PlayerAvatar";
import { TimeSinceStartedCountDown } from "../molecules/TimeSinceStartedCountDown";
import GameEvents from "../organisms/GameEvents";
import GamePodium from "../organisms/GamePodium";
import PlayerKillQrCode from "../organisms/PlayerKillQrCode";

/**
 * @typedef HeroContentAliveProps
 * @property {import("@killer-game/types").GameRecordSanitized} game
 * @property {import("@killer-game/types").PlayerRecordSanitized} currentTarget
 * @property {import("@killer-game/types").PlayerRecord} player
 * @property {import("@killer-game/types").GameActionRecord} action
 *
 * @param {HeroContentAliveProps} props
 */
function HeroContentAlive(props) {
  const t = useTranslations("player-dashboard");
  const lang = useLocale();
  return (
    <>
      <h2 className={STYLES.h2}>{t("PlayerDashboardGameStartedKillCard.youGetKilled")}</h2>
      <p className="mb-2">{t("PlayerDashboardGameStartedKillCard.presentQrCode")}</p>
      <div>
        <PlayerKillQrCode game={props.game} lang={lang} player={props.player} />
      </div>
    </>
  );
}

function HeroContentDead() {
  const t = useTranslations("player-dashboard");
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
 * @property {import("@killer-game/types").GameRecordSanitized} game
 * @property {import("@killer-game/types").PlayerRecord} player
 * @property {import("@killer-game/types").GameRecordSanitized} game
 * @property {import("@killer-game/types").PlayerRecordSanitized[]} players
 *
 * @param {Props} param0
 */
export default function PlayerDashboardGameStarted({ player, game, players }) {
  const t = useTranslations("player-dashboard");
  const tCommon = useTranslations("common");
  const {
    error: playerStatusError,
    loading: playerStatusLoading,
    playerStatus,
  } = usePlayerStatus(player.id, player.private_token);

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
          <TimeSinceStartedCountDown startedAt={String(game.started_at)} />
        </div>
      </div>

      <Fetching loading={playerStatusLoading} error={playerStatusError}>
        {playerStatus && (
          <HeroWithCard
            className="min-h-[80vh]"
            card={
              <>
                <h2 className={STYLES.h1}>{t("PlayerDashboardGameStartedKillCard.yourCurrentMission")}</h2>
                <div className="flex gap-4 mb-3">
                  <PlayerAvatar player={currentTarget} />
                  <div>
                    <div className="flex flex-col gap-3">
                      <p className={STYLES.h2}>{currentTarget?.name}</p>
                      <p>🎯: {currentAction?.name}</p>
                    </div>
                  </div>
                </div>
                <p>
                  {t("PlayerDashboardGameStartedKillCard.youNeedToKill")}{" "}
                  <strong className="text-primary">{currentTarget?.name}</strong>
                  .&nbsp;{t("PlayerDashboardGameStartedKillCard.youNeedToMakeHimDo")}&nbsp;
                  <strong className="text-primary">{currentAction?.name}</strong>
                </p>
                <p className="mb-4">{t("PlayerDashboardGameStartedKillCard.onceDone")}</p>
              </>
            }
            side={
              player.killed_at ? (
                <HeroContentDead />
              ) : (
                <HeroContentAlive
                  currentAction={currentAction}
                  currentTarget={currentTarget}
                  player={player}
                  game={game}
                />
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
