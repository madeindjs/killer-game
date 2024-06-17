"use client";
import { STYLES } from "@/constants/styles";
import { useGameDashboard } from "@/hooks/use-game-dashboard";
import { usePlayerStatus } from "@/hooks/use-player-status";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import CardSection from "../atoms/CardSection";
import HeroWithCard from "../atoms/HeroWithCard";
import Fetching from "../molecules/Fetching";
import GameEvents from "../organisms/GameEvents";
import GamePodium from "../organisms/GamePodium";
import PlayersAvatars from "../organisms/PlayersAvatars";

/**
 * @param {{currentTarget?: import("@killer-game/types").PlayerRecord, currentAction: string}} param0
 */
function HeroContentAlive({ currentTarget, currentAction }) {
  const t = useTranslations("player-dashboard");
  return (
    <>
      <h2 className={STYLES.h1}>{t("PlayerDashboardGameStartedKillCard.yourCurrentMission")}</h2>
      <p>
        {t("PlayerDashboardGameStartedKillCard.youNeedToKill")}{" "}
        <strong className="text-primary">{currentTarget?.name}</strong>
        .&nbsp;{t("PlayerDashboardGameStartedKillCard.youNeedToMakeHimDo")}&nbsp;
        <strong className="text-primary">{currentAction}</strong>
      </p>
      <p className="mb-4">{t("PlayerDashboardGameStartedKillCard.onceDone")}</p>
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
 * @property {import("@killer-game/types").PlayerRecord} player
 * @property {import("@killer-game/types").GameRecordSanitized} game
 * @property {import("@killer-game/types").PlayerRecordSanitized[]} players
 *
 * @param {Props} param0
 */
export default function PlayerDashboardGameFinished({ player, game, players }) {
  const t = useTranslations("player-dashboard");
  const tCommon = useTranslations("common");

  const {
    dashboard,
    error: dashboardError,
    load: loadDashboard,
    loading: dashboardLoading,
  } = useGameDashboard(game.id, player.private_token);
  const {
    error: playerStatusError,
    loading: playerStatusLoading,
    playerStatus,
  } = usePlayerStatus(player.id, player.private_token);

  useEffect(() => {
    loadDashboard();
  }, [players, loadDashboard]);

  return (
    <div>
      <div className="flex mb-4">
        <h1 className={STYLES.h1 + " flex-grow"}>
          {t("PlayerDashboardGameStarted.dear", { player: player?.name ?? "" })}
        </h1>
      </div>

      <HeroWithCard
        card={
          <Fetching loading={dashboardLoading} error={dashboardError}>
            {dashboard && <GamePodium podium={dashboard.podium} />}
          </Fetching>
        }
        side={
          <>
            <h1 className={STYLES.h1}>{t("PlayerDashboardGameFinished.title")}</h1>
            <p>{t("PlayerDashboardGameFinished.headline")}</p>
            <p>{t("PlayerDashboardGameFinished.youKilled")}:</p>
            <Fetching loading={playerStatusLoading} error={playerStatusError}>
              {playerStatus && <PlayersAvatars players={playerStatus.kills.map((k) => k.player)} />}
            </Fetching>
          </>
        }
      />

      <div className="grid lg:grid-cols-2 xs:grid-cols-1 gap-4">
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
