"use client";

import Fetching from "@/components/Fetching";
import GameStartStatus from "@/components/GameStartStatus";
import PlayerCreateForm from "@/components/PlayerCreateForm";
import PlayersAvatars from "@/components/PlayersAvatars";
import { useGame } from "@/hooks/use-game";
import { useGameEvents } from "@/hooks/use-game-events";
import { useGamePlayers } from "@/hooks/use-game-players";
import { createPlayer } from "@/lib/client";
import { getPlayerUrl } from "@/lib/routes";
import { pluralize } from "@/utils/pluralize";
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
              <h1 className="text-5xl font-bold">You have been invited to join a party!</h1>
              <p className="my-6 text-xl">Just fill the form and you are good to go!</p>
              <p className="my-6 text-xl">
                There is already{" "}
                <strong>
                  {players.length}&nbsp;
                  {pluralize(players.length, "player", "players")}
                </strong>{" "}
                in the game.
              </p>
              <div className="overflow-x-auto">
                <PlayersAvatars players={players} className="justify-center" />
              </div>
            </div>
            <div className="card flex-shrink-0 w-full max-w-xl shadow-2xl bg-base-100">
              <div className="card-body">
                <PlayerCreateForm onSubmit={handlePlayerCreate} />
              </div>
            </div>
          </div>
        </div>
      )}
    </Fetching>
  );

  return (
    <Fetching loading={gameLoading} error={gameError}>
      {game && (
        <>
          <div className="hero min-h-screen">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <h1 className="text-5xl font-bold mb-3">You have been invited to join a party!!</h1>

                <hr className="divider" />
                <div className="py-3">
                  <p>Just fill the form and you are good to go!</p>
                  <PlayerCreateForm onSubmit={handlePlayerCreate} />
                </div>
                <hr className="divider" />
                <div className="py-3">
                  <p>
                    There is already <span className="badge badge-secondary">{players.length}</span> players
                  </p>
                  <div className="overflow-x-auto">
                    <PlayersAvatars players={players} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-3xl mb-3">{game.name}</h1>
          <GameStartStatus game={game} readonly />
        </>
      )}
    </Fetching>
  );
}
