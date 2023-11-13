import { STYLES } from "@/constants/styles";
import useTranslation from "next-translate/useTranslation";
import PlayerForm from "../organisms/PlayerForm";
import PlayersAvatars from "../organisms/PlayersAvatars";

export default function PlayerDashboardGameUnStarted({ player, game, players, onPlayerChange }) {
  const { t } = useTranslation("player-dashboard");
  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className={STYLES.h1}>✅ {t("PlayerDashboardGameUnStarted.title")}</h1>
          <p className="my-6 text-xl">{t("PlayerDashboardGameUnStarted.gameWillStartSoon")}</p>
          <span className="loading loading-ball loading-lg"></span>
          <p className="my-6 text-xl">{t("PlayerDashboardGameUnStarted.thereIsPlayerCount", { count: player })}</p>
          <div className="overflow-x-auto">
            <PlayersAvatars players={players} className="justify-center" />
          </div>
        </div>
        <div className="card flex-shrink-0 w-full max-w-xl shadow-2xl bg-base-100">
          <div className="card-body">
            <PlayerForm player={player} onChange={onPlayerChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
