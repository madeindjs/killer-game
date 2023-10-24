"use client";
import AlertError from "@/components/AlertError";
import Loader from "@/components/Loader";
import PlayerAvatar from "@/components/PlayerAvatar";
import PlayerForm from "@/components/PlayerForm";
import PlayersAvatars from "@/components/PlayersAvatars";
import { STYLES } from "@/constants/styles";
import { useGame } from "@/hooks/use-game";
import { useGameEvents } from "@/hooks/use-game-events";
import { useGamePlayers } from "@/hooks/use-game-players";
import { useNotifications } from "@/hooks/use-notifications";
import { usePlayer } from "@/hooks/use-player";
import * as client from "@/lib/client";
import { pluralizePlayers } from "@/utils/pluralize";
import { useCallback } from "react";

/**
 * @typedef Props
 * @property {string} playerId
 * @property {string} playerPrivateToken
 */

/**
 *
 * @param {{player: import("@killer-game/types").PlayerRecord, game: import("@killer-game/types").GameRecord}} param0
 */
function PlayerDashboardGameStarted({ player, game }) {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="max-w-sm shadow-2xl">
          {/* TODO: inject the target */}
          <PlayerAvatar player={player} />
        </div>
        <div>
          <h1 className={STYLES.h1}>Kills</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In
            deleniti eaque aut repudiandae et a id nisi.
          </p>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </div>
    </div>
  );
}

function PlayerDashboardGameUnStarted({ player, game, players, onPlayerChange }) {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className={STYLES.h1}>✅ You're in! The game will start soon.</h1>
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

/**
 * @param {Props} param0
 */
export default function PlayerDashboard({ playerId, playerPrivateToken }) {
  const { notify } = useNotifications();

  const { error: playerError, loading: playerLoading, player, setPlayer } = usePlayer(playerId, playerPrivateToken);
  const { error: gameError, loading: gameLoading, game, setGame } = useGame(player?.game_id);

  const onGameChange = useCallback(
    (gameUpdated) => {
      if (!game?.started_at && gameUpdated.started_at) {
        notify("🏁 The game started");
      } else if (game?.started_at && !gameUpdated.started_at) {
        notify("🎌 The game stopped");
      }
      setGame(gameUpdated);
    },
    [game, setGame, notify]
  );

  const {
    error: playersError,
    loading: playersLoading,
    players,
    addPlayer,
    deletePlayer,
    updatePlayer,
  } = useGamePlayers(player?.game_id);
  useGameEvents(player?.game_id, {
    addPlayer,
    deletePlayer,
    updatePlayer,
    setGame: onGameChange,
  });

  const error = playerError || gameError;

  /**
   * @param {import("@killer-game/types").PlayerRecord} p
   */
  function onPlayerChange(p) {
    setPlayer(p);
    client
      .updatePlayer(p.game_id, p, playerPrivateToken)
      .then((r) => setPlayer(r))
      .catch((err) => setPlayer(player));
  }

  // if (error) return <p>hello</p>;

  if (error)
    return (
      <AlertError>
        Cannot load the game. Please go back to the&nbsp;
        <a href="/" className="link">
          home page
        </a>
      </AlertError>
    );

  if (playerLoading || !player) return <Loader />;
  if (gameLoading || !game) return <Loader />;

  if (game.started_at) {
    return <PlayerDashboardGameStarted game={game} player={player} players={players} />;
  } else {
    return (
      <PlayerDashboardGameUnStarted game={game} player={player} players={players} onPlayerChange={onPlayerChange} />
    );
  }
}
