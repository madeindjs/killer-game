import { getGameUrl } from "@/lib/routes";
import GameStartedBadge from "./GameStartedBadge";
import PlayersAvatars from "./PlayersAvatars";

/**
 * @typedef Props
 * @property {import("@killer-game/types").GameRecord} game
 * @property {import("@killer-game/types").PlayerRecord[]} players
 *
 * @param {Props} param0
 */
export default function GameCard({ game, players }) {
  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          {game.name} <GameStartedBadge game={game} />
        </h2>
        <PlayersAvatars players={players} />
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div className="card-actions justify-end">
          <a href={getGameUrl(game)} className="btn btn-secondary">
            See the game
          </a>
        </div>
      </div>
    </div>
  );
}
