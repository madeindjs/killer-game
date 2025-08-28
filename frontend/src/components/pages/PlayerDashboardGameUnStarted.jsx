import { STYLES } from "@/constants/styles";
import { useTranslations } from "next-intl";
import HeroWithCard from "../atoms/HeroWithCard";
import PlayerForm from "../organisms/PlayerForm";
import PlayersAvatars from "../organisms/PlayersAvatars";

/** @import {GameRecord, PlayerRecord, PlayerRecordSanitized, GameRecordSanitized} from "@killer-game/types"  */

/**
 * @typedef Props
 * @property {PlayerRecord} player
 * @property {PlayerRecordSanitized[]} players
 * @property {(player: PlayerRecord) => void} onPlayerChange
 *
 * @param {Props} param0
 */
export default function PlayerDashboardGameUnStarted({
  player,
  players,
  onPlayerChange,
}) {
  const t = useTranslations("player-dashboard");

  return (
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
  );
}
