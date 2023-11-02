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
          <div className="grid md:grid-cols-3 xs:grid-cols-1 gap-12">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-4">
                <h2 className={STYLES.h2}> {pluralizePlayers(players.length)}</h2>
                <p>There is {pluralizePlayers(players.length)} in the game.</p>
                <Suspense fallback={<p>Loading players avatars</p>}>
                  <PlayersAvatars players={players} />
                </Suspense>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className={STYLES.h2}>Invite more players</h2>
                {game.started_at ? (
                  <p className="text-warning">The game started, you cannot invite new persons in the game.</p>
                ) : (
                  <>
                    <GameJoinLink game={game} />
                    <p>Or you can also add players yourself and share his dashboard link later.</p>
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
                  </>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <h2 className={STYLES.h2 + " mb-4"}>Plan</h2>
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
        </>
      )}
    </Fetching>
  );
}
