"use client";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useMemo, useState } from "react";
import { useGamePlayersTable } from "../../hooks/use-game-players-table";
import Loader from "../atoms/Loader";
import Toggle from "../atoms/Toggle";
import AlertError from "../molecules/AlertError";
import AlertWarning from "../molecules/AlertWarning";
import GamePlayersTimeline from "../organisms/GamePlayersTimeline";
import PlayerModal from "../organisms/PlayerModal";

/**
 * @typedef GameDashboardTimelineProps
 * @property {import("@killer-game/types").GameRecord} game
 * @property {import("@killer-game/types").PlayerRecord[]} players
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerUpdate]
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerDelete]
 *
 * @param {GameDashboardTimelineProps} param0
 */
export default function GameDashboardTimeline({ game, players, onPlayerDelete, onPlayerUpdate }) {
  const { t } = useTranslation("common");
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
      {!table?.length && <AlertWarning className="mb-2">{t("GameTimeline.notEnoughPlayers")}</AlertWarning>}
      <Toggle
        checked={displayDead}
        labelUnchecked={t("GameTimeline.displayAllPlayers")}
        labelChecked={t("GameTimeline.hideDeadPlayers")}
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
