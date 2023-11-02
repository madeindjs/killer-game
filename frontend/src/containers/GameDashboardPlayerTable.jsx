"use client";
import AlertError from "@/components/AlertError";
import AlertWarning from "@/components/AlertWarning";
import Loader from "@/components/Loader";
import PlayerModal from "@/components/PlayerModal";
import PlayersTable from "@/components/PlayersTable";
import { useEffect, useMemo, useState } from "react";
import { useGamePlayersTable } from "../hooks/use-game-players-table";

/**
 * @typedef PlayersTableProps
 * @property {import("@killer-game/types").GameRecord} game
 * @property {import("@killer-game/types").PlayerRecord[]} players
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerUpdate]
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerDelete]
 *
 * @param {PlayersTableProps} param0
 */
export function GameDashboardPlayerTable({ game, players, onPlayerDelete, onPlayerUpdate }) {
  const { error, loading, table, load } = useGamePlayersTable(game.id, game.private_token);

  useEffect(load, [game.id, load, players]);

  const [activePlayerId, setActivePlayerId] = useState(undefined);

  const activePlayer = useMemo(
    () => (activePlayerId ? players.find((p) => activePlayerId === p.id) : undefined),
    [activePlayerId, players]
  );

  return (
    <>
      {loading && <Loader />}
      {error && <AlertError>Could not load table</AlertError>}
      {!table?.length && <AlertWarning className="mb-2">You do not have any player in the game.</AlertWarning>}
      {!!table?.length && (
        <PlayersTable
          table={table}
          players={players}
          onPlayerClick={(p) => setActivePlayerId(p.id)}
          onPlayerUpdate={onPlayerUpdate}
        />
      )}
      <PlayerModal
        player={activePlayer}
        onPlayerUpdate={onPlayerUpdate}
        onClosed={() => setActivePlayerId(undefined)}
        onPlayerDelete={() => {
          onPlayerDelete?.(activePlayer);
          setActivePlayerId(undefined);
          load();
        }}
      />
    </>
  );
}
