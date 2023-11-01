"use client";

import { client } from "@/lib/client";

import Fetching from "@/components/Fetching";
import GameJoinLink from "@/components/GameJoinLink";
import GameStartButton from "@/components/GameStartButton";
import GameStartedBadge from "@/components/GameStartedBadge";
import Modal from "@/components/Modal";
import PlayerCreateForm from "@/components/PlayerCreateForm";
import PlayersAvatars from "@/components/PlayersAvatars";
import { STYLES } from "@/constants/styles";
import { useGame } from "@/hooks/use-game";
import { useGameEvents } from "@/hooks/use-game-events";
import { useGamePlayers } from "@/hooks/use-game-players";
import { useNotifications } from "@/hooks/use-notifications";
import { Suspense, useCallback, useState } from "react";
import { GameDashboardPlayerTable } from "./GameDashboardPlayerTable";

/**
 * @param {{gameId: string, gamePrivateToken?: string}} param0
 * @returns
 */
export default function GameDashboard({ gameId, gamePrivateToken }) {
  const { notify } = useNotifications();

  const { error: gameError, loading: gameLoading, game, setGame } = useGame(gameId, gamePrivateToken);
  const { players, addPlayer, deletePlayer, updatePlayer } = useGamePlayers(gameId, gamePrivateToken);

  const [newPlayerModalOpen, setNewPlayerModalOpen] = useState();

  const onAddPlayer = useCallback(
    (player) => {
      notify("🏁 The game started");
      addPlayer(player);
    },
    [addPlayer, notify]
  );

  useGameEvents(gameId, { onAddPlayer, deletePlayer, updatePlayer, setGame });

  function handlePlayerUpdate(player) {
    client.updatePlayer(gameId, player, gamePrivateToken).then(updatePlayer);
  }

  function handlePlayerDelete(player) {
    client.deletePlayer(gameId, player.id, gamePrivateToken).then(() => deletePlayer(player));
  }

  function handlePlayerCreate(player) {
    client.createPlayer(gameId, player).then(addPlayer);
  }

  function handleGameStartToggle() {
    const gameUpdate = {
      ...game,
      started_at: game.started_at ? null : new Date().toISOString(),
    };

    setGame(gameUpdate);
    client
      .updateGame(gameUpdate)
      .then(setGame)
      .catch(() => setGame(game));
  }

  return (
    <Fetching loading={gameLoading} error={gameError}>
      {game && (
        <>
          <div className="mb-5 flex items-center">
            <h1 className={`${STYLES.h1} flex-grow`}>
              {game.name} <GameStartedBadge game={game} />
            </h1>
            <Suspense fallback={<p>Loading players avatars</p>}>
              <PlayersAvatars players={players} />
            </Suspense>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <div>
              <GameStartButton game={game} onChange={handleGameStartToggle} readonly={players?.length > 1} />
              <p>Share this URL to let user join the party</p>
              <GameJoinLink game={game} />
              <h2 className="text-2xl mb-1 flex-grow">
                Players <span className="badge badge-secondary">{players.length}</span>
              </h2>
              {!game.started_at && (
                <>
                  <button type="button" className="btn btn-secondary" onClick={() => setNewPlayerModalOpen(true)}>
                    Add a player
                  </button>
                  <Modal
                    isOpen={newPlayerModalOpen}
                    title="Add new player"
                    onClosed={() => setNewPlayerModalOpen(false)}
                    content={
                      <Suspense fallback={<p>Loading player form</p>}>
                        <PlayerCreateForm onSubmit={handlePlayerCreate} />
                      </Suspense>
                    }
                  />
                </>
              )}
            </div>
            <div className="col-span-2">
              <div className="overflow-x-auto">
                {game && (
                  <Suspense fallback={<p>Loading players table</p>}>
                    <GameDashboardPlayerTable
                      players={players}
                      game={game}
                      onPlayerUpdate={handlePlayerUpdate}
                      onPlayerDelete={handlePlayerDelete}
                    />
                  </Suspense>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Fetching>
  );
}
