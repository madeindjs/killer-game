"use client";
import AlertError from "@/components/AlertError";
import Fetching from "@/components/Fetching";
/**
 * @typedef Props
 * @property {string} playerId
 * @property {string} playerPrivateToken
 */

import Loader from "@/components/Loader";
import PlayerAvatar from "@/components/PlayerAvatar";
import PlayersAvatars from "@/components/PlayersAvatars";
import { useGame } from "@/hooks/use-game";
import { useGameEvents } from "@/hooks/use-game-events";
import { useGamePlayers } from "@/hooks/use-game-players";
import { usePlayer } from "@/hooks/use-player";
import { Link } from "next/link";

/**
 * @typedef State
 * @property {}
 */

/**
 * @param {Props} param0
 */
export default function PlayerDashboard({ playerId, playerPrivateToken }) {
  const { error: playerError, loading: playerLoading, player } = usePlayer(playerId, playerPrivateToken);
  const { error: gameError, loading: gameLoading, game } = useGame(player?.game_id);
  const { error: playersError, loading: playersLoading, players, setPlayers } = useGamePlayers(player?.game_id);

  useGameEvents(player?.game_id, { setPlayers });

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
      <div className="flex items-center gap-5">
        <PlayerAvatar player={player} />
        <div>
          <h1 className="text-3xl text-bold">👋 hello, {player.name}</h1>
        </div>
      </div>
      <p>
        You currently participating to &nbsp;
        <Fetching loading={gameLoading} error={gameError}>
          {game?.name}
        </Fetching>
      </p>
      <Fetching loading={playersLoading} error={playersError}>
        <p>You are not alone, there is already {players.length} players.</p>
        <PlayersAvatars players={players} />
      </Fetching>
    </>
  );
}
