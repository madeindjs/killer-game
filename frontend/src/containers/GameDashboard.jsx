"use client";

import * as client from "@/lib/client";

import Fetching from "@/components/Fetching";
import GameJoinLink from "@/components/GameJoinLink";
import GameStartButton from "@/components/GameStartButton";
import GameStartedBadge from "@/components/GameStartedBadge";
import PlayerCreateForm from "@/components/PlayerCreateForm";
import PlayersAvatars from "@/components/PlayersAvatars";
import PlayersCards from "@/components/PlayersCards";
import { STYLES } from "@/constants/styles";
import { useGame } from "@/hooks/use-game";
import { useGameEvents } from "@/hooks/use-game-events";
import { useGamePlayers } from "@/hooks/use-game-players";
import { useNotifications } from "@/hooks/use-notifications";
import { useCallback } from "react";

/**
 * @param {{gameId: string, gamePrivateToken?: string}} param0
 * @returns
 */
export default function GameDashboard({ gameId, gamePrivateToken }) {
  const { notify } = useNotifications();

  const { error: gameError, loading: gameLoading, game, setGame } = useGame(gameId, gamePrivateToken);
  const { players, addPlayer, deletePlayer, updatePlayer } = useGamePlayers(gameId, gamePrivateToken);

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
    client.updateGame(gameUpdate).then(setGame);
  }

  return (
    <Fetching loading={gameLoading} error={gameError}>
      {game && (
        <>
          <h1 className={`${STYLES.h1} text-center`}>
            {game.name} <GameStartedBadge game={game} />
          </h1>
          <GameStartButton game={game} onChange={handleGameStartToggle} />
          <p>Share this URL to let user join the party</p>
          <GameJoinLink game={game} />
          <div className="flex sticky top-0 relative z-10 backdrop-blur pt-2">
            <h2 className="text-2xl mb-1 flex-grow">
              Players <span className="badge badge-secondary">{players.length}</span>
            </h2>
            <div className="overflow-x-auto">
              <PlayersAvatars players={players} />
            </div>
          </div>
          <PlayersCards
            gameId={game.id}
            players={players}
            actions={game.actions}
            onPlayerUpdate={handlePlayerUpdate}
            onPlayerDelete={handlePlayerDelete}
          />

          {!game.started_at && (
            <div className="py-2">
              <div className="card w-96 bg-base-300 shadow-xl">
                <div className="card-body">
                  <p className="card-title">New player</p>
                  <PlayerCreateForm onSubmit={handlePlayerCreate} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Fetching>
  );
}
