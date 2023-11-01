"use client";
import AlertError from "@/components/AlertError";
import AlertWarning from "@/components/AlertWarning";
import Loader from "@/components/Loader";
import PlayerModal from "@/components/PlayerModal";
import PlayersTable from "@/components/PlayersTable";
import { useEffect, useState } from "react";
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

  const [activePlayer, setActivePlayer] = useState(null);

  return (
    <>
      {loading && <Loader />}
      {error && <AlertError>Could not load table</AlertError>}
      {!table?.length && <AlertWarning className="mb-2">You do not have any player in the game.</AlertWarning>}
      {!!table?.length && (
        <PlayersTable table={table} players={players} onPlayerClick={setActivePlayer} onPlayerUpdate={onPlayerUpdate} />
      )}
      <PlayerModal
        player={activePlayer}
        onPlayerUpdate={onPlayerUpdate}
        onClosed={() => setActivePlayer(null)}
        onPlayerDelete={() => {
          onPlayerDelete?.(activePlayer);
          activePlayer(null);
          load();
        }}
      />
    </>
  );
}
