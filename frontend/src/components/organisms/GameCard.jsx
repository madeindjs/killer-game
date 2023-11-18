import { getGameUrl } from "@/lib/routes";
import useTranslation from "next-translate/useTranslation";
import GameStartedBadge from "./GameStartedBadge";
import PlayersAvatars from "./PlayersAvatars";

/**
 * @typedef Props
 * @property {import("@killer-game/types").GameRecord} game
 * @property {import("@killer-game/types").PlayerRecord[]} players
 * @property {string} i18nSeeGame
 * @property {string} i18nProgress
 * @property {string} i18nPending
 *
 * @param {Props} param0
 */
export default function GameCard({ game, players }) {
  const { t } = useTranslation("common");
  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          {game.name} <GameStartedBadge game={game} />
        </h2>
        <PlayersAvatars players={players} />
        <div className="card-actions justify-end">
          <a href={getGameUrl(game)} className="btn btn-secondary">
            {t("GameCard.see")}
          </a>
        </div>
      </div>
    </div>
  );
}
