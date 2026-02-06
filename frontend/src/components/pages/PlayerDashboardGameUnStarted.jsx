import { STYLES } from "@/constants/styles";
import { useGameDashboard } from "@/hooks/use-game-dashboard";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import HeroWithCard from "../atoms/HeroWithCard";
import CardSection from "../atoms/CardSection";
import Fetching from "../molecules/Fetching";
import PlayerForm from "../organisms/PlayerForm";
import PlayersAvatars from "../organisms/PlayersAvatars";
import GameEvents from "../organisms/GameEvents";
import GamePodium from "../organisms/GamePodium";

/** @import {GameRecord, PlayerRecord, PlayerRecordSanitized, GameRecordSanitized} from "@killer-game/types"  */

/**
 * @typedef Props
 * @property {GameRecordSanitized} game
 * @property {PlayerRecord} player
 * @property {PlayerRecordSanitized[]} players
 * @property {(player: PlayerRecord) => void} onPlayerChange
 *
 * @param {Props} param0
 */
export default function PlayerDashboardGameUnStarted({
  game,
  player,
  players,
  onPlayerChange,
}) {
  const t = useTranslations("player-dashboard");
  const tCommon = useTranslations("common");
  const {
    dashboard,
    error: dashboardError,
    load: loadDashboard,
    loading: dashboardLoading,
  } = useGameDashboard(game?.id, player?.private_token);

  useEffect(() => {
    if (game?.id && player?.private_token) loadDashboard();
  }, [game?.id, player?.private_token, loadDashboard]);

  const hasKills = dashboard && dashboard.events.length > 0;

  return (
    <>
      <HeroWithCard
        card={<PlayerForm player={player} onChange={onPlayerChange} />}
        side={
          <>
            <h1 className={STYLES.h1}>
              ✅ {t("PlayerDashboardGameUnStarted.title")}
            </h1>
            <p className="my-6 text-xl">
              {t("PlayerDashboardGameUnStarted.gameWillStartSoon")}
            </p>
            <span className="loading loading-ball loading-lg"></span>
            <p className="my-6 text-xl">
              {t("PlayerDashboardGameUnStarted.thereIsPlayerCount", {
                count: players.length,
              })}
            </p>
            <div className="overflow-x-auto">
              <PlayersAvatars players={players} className="justify-center" />
            </div>
          </>
        }
      />
      {hasKills && (
        <div className="grid md:grid-cols-2 xs:grid-cols-1 gap-4 mt-4">
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
      )}
    </>
  );
}
