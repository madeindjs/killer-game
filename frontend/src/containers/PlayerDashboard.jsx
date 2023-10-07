"use client";
import AlertError from "@/components/AlertError";
/**
 * @typedef Props
 * @property {string} playerId
 * @property {string} playerPrivateToken
 */

import Loader from "@/components/Loader";
import PlayerAvatar from "@/components/PlayerAvatar";
import PlayersAvatars from "@/components/PlayersAvatars";
import { useGame } from "@/hooks/use-game";
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
  const { error: playersError, loading: playersLoading, players } = useGamePlayers(player?.game_id);

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
      <p>You currently participating to {gameLoading ? "Loading..." : game?.name}</p>
      {playersLoading ? (
        <div aria-busy="true">
          Loading players
          <Loader />
        </div>
      ) : (
        <PlayersAvatars players={players} />
      )}
    </>
  );
}
