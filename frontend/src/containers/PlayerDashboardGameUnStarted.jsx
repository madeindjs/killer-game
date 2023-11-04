import PlayerForm from "@/components/PlayerForm";
import PlayersAvatars from "@/components/PlayersAvatars";
import { STYLES } from "@/constants/styles";
import { pluralizePlayers } from "@/utils/pluralize";

export default function PlayerDashboardGameUnStarted({ player, game, players, onPlayerChange }) {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className={STYLES.h1}>✅ You are in! The game will start soon.</h1>
          <p className="my-6 text-xl">The game master will start the game soon.</p>
          <span className="loading loading-ball loading-lg"></span>
          <p className="my-6 text-xl">
            There is already <strong>{pluralizePlayers(players.length)}</strong> in the game.
          </p>
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
