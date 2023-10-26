import AlertError from "@/components/AlertError";
import Loader from "@/components/Loader";
import PlayersTable from "@/components/PlayersTable";
import { useEffect } from "react";
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
export function GameDashboardPlayerTable({ game, players, playersCount, onPlayerDelete, onPlayerUpdate }) {
  const { error, loading, table, load } = useGamePlayersTable(game.id, game.private_token);

  useEffect(load, [game, load, playersCount]);

  return (
    <>
      {loading && <Loader />}
      {error && <AlertError>Could not load table</AlertError>}
      {table && (
        <PlayersTable
          table={table}
          players={players}
          editable={!game.started_at}
          onPlayerDelete={(player) => {
            onPlayerDelete?.(player);
            load();
          }}
          onPlayerUpdate={onPlayerUpdate}
        />
      )}
    </>
  );
}
