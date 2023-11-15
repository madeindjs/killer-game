"use client";
import { STYLES } from "@/constants/styles";
import { useGameDashboard } from "@/hooks/use-game-dashboard";
import { usePlayerStatus } from "@/hooks/use-player-status";
import useTranslation from "next-translate/useTranslation";
import { useEffect } from "react";
import CardSection from "../atoms/CardSection";
import Fetching from "../molecules/Fetching";
import GameEvents from "../organisms/GameEvents";
import GamePodium from "../organisms/GamePodium";
import { PlayerKilledCard } from "../organisms/PlayerKilledCard";
import { PlayerDashboardGameStartedKillCard } from "./PlayerDashboardGameStartedKillCard";

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

  useEffect(loadDashboard, [players, loadDashboard]);

  return (
    <div>
      <h1 className={"mb-4 " + STYLES.h1}>{t("PlayerDashboardGameStarted.dear", { player: player?.name ?? "" })}</h1>

      <div className="grid md:grid-cols-3 lg:grid-cols-2 xs:grid-cols-1 gap-4">
        <div className="flex gap-4 flex-col">
          <Fetching loading={playerStatusLoading} error={playerStatusError}>
            {playerStatus && (
              <PlayerDashboardGameStartedKillCard
                player={player}
                target={playerStatus.current.player}
                action={playerStatus.current.action}
                onKill={load}
              />
            )}
          </Fetching>

          <CardSection>
            <Fetching loading={playerStatusLoading} error={playerStatusError}>
              {playerStatus && (
                <>
                  <h2 className="card-title">
                    {t("PlayerDashboardGameStarted.youKilledCount", { count: playerStatus.kills.length })}
                  </h2>
                  {playerStatus.kills.map((kill) => (
                    <PlayerKilledCard key={player.id} player={kill.player} action={kill.action} />
                  ))}
                </>
              )}
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
          <CardSection>
            <h2 className="card-title">{tCommon("dashboard.podium")}</h2>
            <Fetching loading={dashboardLoading} error={dashboardError}>
              {dashboard && <GamePodium podium={dashboard.podium} />}
            </Fetching>
          </CardSection>
        </div>
      </div>
    </div>
  );
}
