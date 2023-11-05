"use client";
import { useMemo, useState } from "react";
import PlayerModal from "../organisms/PlayerModal";
import PlayersTable from "../organisms/PlayersTable";

/**
 * @typedef GameDashboardTabsPlayersProps
 * @property {import("@killer-game/types").GameRecord} game
 * @property {import("@killer-game/types").PlayerRecord[]} players
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerUpdate]
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerDelete]
 *
 * @param {GameDashboardTabsPlayersProps} param0
 */
export default function GameDashboardTabsPlayers({ game, players, onPlayerDelete, onPlayerUpdate }) {
  const [editedPlayerId, setEditedPlayerId] = useState(undefined);

  const editedPlayer = useMemo(
    () => (editedPlayerId ? players.find((p) => p.id === editedPlayerId) : undefined),
    [editedPlayerId, players]
  );

  return (
    <>
      <PlayersTable
        players={players}
        editable={!game.started_at}
        onPlayerClick={(p) => setEditedPlayerId(p.id)}
        onEditClick={(p) => setEditedPlayerId(p.id)}
        onDeleteClick={(p) => onPlayerDelete(p)}
      />
      <PlayerModal
        player={editedPlayer}
        actions={game.actions}
        onClosed={() => setEditedPlayerId(undefined)}
        onPlayerUpdate={onPlayerUpdate}
        onPlayerDelete={() => onPlayerDelete(editedPlayer)}
      />
    </>
  );
}
