"use client";

import { client } from "@/lib/client";

import Fetching from "@/components/Fetching";
import GameJoinLink from "@/components/GameJoinLink";
import GameStartButton from "@/components/GameStartButton";
import Modal from "@/components/Modal";
import PlayerCreateForm from "@/components/PlayerCreateForm";
import PlayersAvatars from "@/components/PlayersAvatars";
import { STYLES } from "@/constants/styles";
import { useGame } from "@/hooks/use-game";
import { useGameEvents } from "@/hooks/use-game-events";
import { useGamePlayers } from "@/hooks/use-game-players";
import { useNotifications } from "@/hooks/use-notifications";
import { pluralizePlayers } from "@/utils/pluralize";
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
    const oldPlayer = players.find((p) => p.id === player.id);
    updatePlayer(player);
    client.updatePlayer(gameId, player, gamePrivateToken).catch(() => updatePlayer(oldPlayer));
  }

  function handlePlayerDelete(player) {
    client.deletePlayer(gameId, player.id, gamePrivateToken).then(() => deletePlayer(player));
  }

  function handlePlayerCreate(player) {
    client
      .createPlayer(gameId, player)
      .then(addPlayer)
      .then(() => setNewPlayerModalOpen(false));
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
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <h1 className={`${STYLES.h1} flex-grow`}>{game.name}</h1>
            <GameStartButton game={game} onChange={handleGameStartToggle} readonly={players?.length > 1} />
          </div>
          <div className="grid md:grid-cols-3 xs:grid-cols-1 gap-8">
            <div className="flex flex-col gap-4">
              <div>
                <p className="mb-2">There is {pluralizePlayers(players.length)} in the game.</p>
                <Suspense fallback={<p>Loading players avatars</p>}>
                  <PlayersAvatars players={players} />
                </Suspense>
              </div>

              <GameJoinLink game={game} />
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
                {!game.started_at && (
                  <div className="mt-4 flex justify-end">
                    <button type="button" className="btn btn-secondary" onClick={() => setNewPlayerModalOpen(true)}>
                      ➕ Add a player
                    </button>
                    <Modal
                      isOpen={newPlayerModalOpen}
                      title="Add new player"
                      onClosed={() => setNewPlayerModalOpen(false)}
                      content={
                        <Suspense fallback={<p>Loading player form</p>}>
                          <PlayerCreateForm onSubmit={handlePlayerCreate} actions={game.actions} />
                        </Suspense>
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Fetching>
  );
}
