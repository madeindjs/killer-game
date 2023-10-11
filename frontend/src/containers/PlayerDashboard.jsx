"use client";
import AlertError from "@/components/AlertError";
import Fetching from "@/components/Fetching";
import GameStartedBadge from "@/components/GameStartedBadge";
/**
 * @typedef Props
 * @property {string} playerId
 * @property {string} playerPrivateToken
 */

import Loader from "@/components/Loader";
import PlayerAvatar from "@/components/PlayerAvatar";
import PlayersAvatars from "@/components/PlayersAvatars";
import { TimeSinceStartedCountDown } from "@/components/TimeSinceStartedCountDown";
import { STYLES } from "@/constants/styles";
import { useGame } from "@/hooks/use-game";
import { useGameEvents } from "@/hooks/use-game-events";
import { useGamePlayers } from "@/hooks/use-game-players";
import { usePlayer } from "@/hooks/use-player";
import { pluralizePlayers } from "@/utils/pluralize";
import { Link } from "next/link";

/**
 * @param {{player: import("@killer-game/types").PlayerRecord}} param0
 * @returns
 */
function PlayerDashboardGameTitle({ player }) {
  return (
    <div className="flex items-center gap-5">
      <PlayerAvatar player={player} />
      <div>
        <h1 className={STYLES.h1}>👋 hello, {player.name}</h1>
      </div>
    </div>
  );
}

/**
 *
 * @param {{player: import("@killer-game/types").PlayerRecord, game: import("@killer-game/types").GameRecord}} param0
 */
function PlayerDashboardGameStarted({ player, game }) {
  return (
    <>
      <p class="py-6">The game has started.</p>
      <TimeSinceStartedCountDown startedAt={game.started_at} />
    </>
  );
}

function PlayerDashboardGameUnStarted({ player, game }) {
  return (
    <>
      <p class="py-6">The game has not started yet.</p>
      <button class="btn btn-primary">Get Started</button>
    </>
  );
}

function PlayerDashboardGamePending({ game, players, player }) {
  return (
    <div class="hero min-h-screen">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <PlayerDashboardGameTitle player={player} />
          {game.started_at ? (
            <PlayerDashboardGameStarted player={player} game={game} />
          ) : (
            <PlayerDashboardGameUnStarted player={player} game={game} />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * @param {Props} param0
 */
export default function PlayerDashboard({ playerId, playerPrivateToken }) {
  const { error: playerError, loading: playerLoading, player } = usePlayer(playerId, playerPrivateToken);
  const { error: gameError, loading: gameLoading, game, setGame } = useGame(player?.game_id);
  const {
    error: playersError,
    loading: playersLoading,
    players,
    addPlayer,
    deletePlayer,
    updatePlayer,
  } = useGamePlayers(player?.game_id);
  useGameEvents(player?.game_id, { addPlayer, deletePlayer, updatePlayer, setGame });

  const error = playerError || gameError;

  if (error)
    return (
      <AlertError>
        Cannot load the game. Please go back to the&nbsp;
        <Link href="/" className="link">
          home page
        </Link>
      </AlertError>
    );

  if (playerLoading || !player) return <Loader />;

  return (
    <>
      <Fetching loading={gameLoading} error={gameError}>
        <Fetching loading={playerLoading} error={playerError}>
          {player && game?.started_at && <PlayerDashboardGamePending game={game} player={player} players={player} />}
        </Fetching>
      </Fetching>

      <p>
        You currently participating to &nbsp;
        <Fetching loading={gameLoading} error={gameError}>
          {game && (
            <>
              {game?.name}
              <GameStartedBadge game={game} readonly />
            </>
          )}
        </Fetching>
      </p>
      <Fetching loading={playersLoading} error={playersError}>
        <h2 className={STYLES.h2}>There is already {pluralizePlayers(players.length)}.</h2>
        <PlayersAvatars players={players} />
      </Fetching>
    </>
  );
}
