"use client";
import { useEffect, useMemo, useState } from "react";
import { useGamePlayersTable } from "../../hooks/use-game-players-table";
import Loader from "../atoms/Loader";
import Toggle from "../atoms/Toggle";
import AlertError from "../molecules/AlertError";
import AlertWarning from "../molecules/AlertWarning";
import GamePlayersTimeline from "../organisms/GamePlayersTimeline";
import PlayerModal from "../organisms/PlayerModal";

/**
 * @typedef GameDashboardTimelineI18n
 * @property {string} notEnoughPlayers
 * @property {string} displayAllPlayers
 * @property {string} hideDeadPlayers
 * @property {import("../organisms/GamePlayersTimeline").GamePlayersTimelineI18n} GamePlayersTimeline
 * @property {import("../organisms/PlayerAvatarWithStatus").PlayerAvatarWithStatusI18n} PlayerAvatarWithStatus
 *
 * @typedef GameDashboardTimelineProps
 * @property {import("@killer-game/types").GameRecord} game
 * @property {import("@killer-game/types").PlayerRecord[]} players
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerUpdate]
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerDelete]
 * @property {GameDashboardTimelineI18n} i18n
 *
 * @param {GameDashboardTimelineProps} param0
 */
export default function GameDashboardTimeline({ game, players, onPlayerDelete, onPlayerUpdate, i18n }) {
  const { error, loading, table, load } = useGamePlayersTable(game.id, game.private_token);
  const [displayDead, setDisplayDead] = useState(false);

  useEffect(() => load({ displayAllPlayers: displayDead }), [game.id, load, players, displayDead]);

  const [activePlayerId, setActivePlayerId] = useState(undefined);

  const activePlayer = useMemo(
    () => (activePlayerId ? players.find((p) => activePlayerId === p.id) : undefined),
    [activePlayerId, players]
  );

  return (
    <>
      {error && <AlertError>Could not load table</AlertError>}
      {!table?.length && <AlertWarning className="mb-2">{i18n.notEnoughPlayers}</AlertWarning>}
      <Toggle
        checked={displayDead}
        labelUnchecked={i18n.displayAllPlayers}
        labelChecked={i18n.hideDeadPlayers}
        onChange={setDisplayDead}
      />
      {!!table?.length && (
        <GamePlayersTimeline
          table={table}
          players={players}
          actions={game.actions}
          editable={!game.started_at}
          onPlayerClick={(p) => setActivePlayerId(p.id)}
          onPlayerUpdate={onPlayerUpdate}
          i18n={{ ...i18n.GamePlayersTimeline, PlayerAvatarWithStatus: i18n.PlayerAvatarWithStatus }}
        />
      )}
      <PlayerModal
        player={activePlayer}
        actions={game.actions}
        onPlayerUpdate={onPlayerUpdate}
        onClosed={() => setActivePlayerId(undefined)}
        onPlayerDelete={() => {
          onPlayerDelete?.(activePlayer);
          setActivePlayerId(undefined);
          load();
        }}
      />
      {loading && <Loader />}
    </>
  );
}
