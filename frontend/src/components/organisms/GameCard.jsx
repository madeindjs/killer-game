import { DEFAULT_LANG } from "@/lib/i18n";
import { getGameUrl } from "@/lib/routes";
import GameStartedBadge from "./GameStartedBadge";
import PlayersAvatars from "./PlayersAvatars";

/**
 * @typedef Props
 * @property {import("@killer-game/types").GameRecord} game
 * @property {import("@killer-game/types").PlayerRecord[]} players
 * @property {import("@/lib/i18n").Lang} lang
 *
 * @param {Props} param0
 */
export default function GameCard({ game, players, lang = DEFAULT_LANG }) {
  const translations = {
    en: {
      see: "Games created",
    },
    fr: {
      see: "Parties crées",
    },
  };

  const t = translations[lang];

  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          {game.name} <GameStartedBadge game={game} lang={lang} />
        </h2>
        <PlayersAvatars players={players} />
        <div className="card-actions justify-end">
          <a href={getGameUrl(game)} className="btn btn-secondary">
            {t.see}
          </a>
        </div>
      </div>
    </div>
  );
}
