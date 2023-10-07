"use client";
import AlertError from "@/components/AlertError";
/**
 * @typedef Props
 * @property {string} playerId
 * @property {string} playerPrivateToken
 */

import Loader from "@/components/Loader";
import PlayerAvatar from "@/components/PlayerAvatar";
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
  const { error, loading, player } = usePlayer(playerId, playerPrivateToken);

  if (error)
    return (
      <AlertError>
        Cannot load the game. Please go back to the&nbsp;
        <Link href="/" className="link">
          home page
        </Link>
      </AlertError>
    );

  if (loading || !player) return <Loader />;

  return (
    <>
      <div className="flex items-center gap-5">
        <PlayerAvatar player={player} />
        <div>
          <h1 className="text-3xl text-bold">👋 hello, {player.name}</h1>
        </div>
      </div>
    </>
  );
}
