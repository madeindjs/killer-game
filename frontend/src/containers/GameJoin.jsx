"use client";

import AlertWarning from "@/components/AlertWarning";
import Fetching from "@/components/Fetching";
import PlayerCreateForm from "@/components/PlayerCreateForm";
import PlayersAvatars from "@/components/PlayersAvatars";
import { STYLES } from "@/constants/styles";
import { useGame } from "@/hooks/use-game";
import { useGameEvents } from "@/hooks/use-game-events";
import { useGamePlayers } from "@/hooks/use-game-players";
import { createPlayer } from "@/lib/client";
import { getPlayerUrl } from "@/lib/routes";
import { pluralizePlayers } from "@/utils/pluralize";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * @param {{gameId: string}} param0
 * @returns
 */
export default function GameJoin({ gameId }) {
  const { error: gameError, loading: gameLoading, game, setGame } = useGame(gameId);
  const { players, addPlayer, deletePlayer, updatePlayer } = useGamePlayers(gameId);
  useGameEvents(gameId, { addPlayer, deletePlayer, updatePlayer, setGame });

  const [gameCreateBusy, setGameCreateBusy] = useState(false);
  const [gameCreateError, setGameCreateError] = useState();

  const router = useRouter();

  function handlePlayerCreate(player) {
    setGameCreateBusy(true);
    createPlayer(gameId, player)
      .then((player) => router.push(getPlayerUrl(player)))
      .catch(setGameCreateError)
      .finally(() => setGameCreateBusy(false));
  }

  return (
    <Fetching loading={gameLoading} error={gameError}>
      {game && (
        <div className="hero min-h-screen">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="text-center lg:text-left">
              <h1 className={STYLES.h1}>You have been invited to join a party!</h1>
              <p className="my-6 text-xl">Just fill the form and you are good to go!</p>
              <p className="my-6 text-xl">
                There is already <strong>{pluralizePlayers(players.length)}</strong> in the game.
              </p>
              <div className="overflow-x-auto">
                <PlayersAvatars players={players} className="justify-center" />
              </div>
            </div>
            <div className="card flex-shrink-0 w-full max-w-xl shadow-2xl bg-base-100">
              <div className="card-body">
                <PlayerCreateForm onSubmit={handlePlayerCreate} busy={gameCreateBusy || game.started_at} />
                {game.started_at && <AlertWarning>The game already started, you cannot register 🫠</AlertWarning>}
              </div>
            </div>
          </div>
        </div>
      )}
    </Fetching>
  );
}
