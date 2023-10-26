import AlertError from "@/components/AlertError";
import Loader from "@/components/Loader";
import PlayersTable from "@/components/PlayersTable";
import { useGamePlayersTable } from "../hooks/use-game-players-table";

/**
 * @typedef PlayersTableProps
 * @property {import("@killer-game/types").GameRecord} game
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerUpdate]
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerDelete]
 * @property {boolean} [editable]
 *
 * @param {PlayersTableProps} param0
 */
export function GameDashboardPlayerTable({ game, onPlayerDelete, onPlayerUpdate }) {
  const { error, loading, table } = useGamePlayersTable(game.id, game.private_token);

  return (
    <>
      {loading && <Loader />}
      {error && <AlertError>Could not load table</AlertError>}
      {table && (
        <PlayersTable
          table={table}
          editable={!game.started_at}
          onPlayerDelete={onPlayerDelete}
          onPlayerUpdate={onPlayerUpdate}
        />
      )}
    </>
  );
}
