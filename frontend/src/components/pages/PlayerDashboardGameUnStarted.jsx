import { STYLES } from "@/constants/styles";
import useTranslation from "next-translate/useTranslation";
import HeroWithCard from "../atoms/HeroWithCard";
import PlayerForm from "../organisms/PlayerForm";
import PlayersAvatars from "../organisms/PlayersAvatars";

/**
 * @typedef Props
 * @property {import("@killer-game/types").GameRecord} game
 * @property {import("@killer-game/types").PlayerRecord} player
 * @property {import("@killer-game/types").PlayerRecordSanitized[]} player
 * @property {(import("@killer-game/types").PlayerRecordSanitized[]) => void} onPlayerChange
 *
 * @param {Props} param0
 * @returns
 */
export default function PlayerDashboardGameUnStarted({ player, game, players, onPlayerChange }) {
  const { t } = useTranslation("player-dashboard");

  return (
    <HeroWithCard
      card={<PlayerForm player={player} onChange={onPlayerChange} />}
      side={
        <>
          <h1 className={STYLES.h1}>✅ {t("PlayerDashboardGameUnStarted.title")}</h1>
          <p className="my-6 text-xl">{t("PlayerDashboardGameUnStarted.gameWillStartSoon")}</p>
          <span className="loading loading-ball loading-lg"></span>
          <p className="my-6 text-xl">
            {t("PlayerDashboardGameUnStarted.thereIsPlayerCount", { count: players.length })}
          </p>
          <div className="overflow-x-auto">
            <PlayersAvatars players={players} className="justify-center" />
          </div>
        </>
      }
    />
  );
}
