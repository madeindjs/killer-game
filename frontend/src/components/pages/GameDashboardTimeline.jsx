"use client";
import useTranslation from "next-translate/useTranslation";
import { useMemo, useState } from "react";
import { useGamePlayersTable } from "../../hooks/use-game-players-table";
import Empty from "../atoms/Empty";
import Loader from "../atoms/Loader";
import Toggle from "../atoms/Toggle";
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
  const [displayDead, setDisplayDead] = useState(false);
  const { error, loading, table, load } = useGamePlayersTable(game.id, game.private_token, displayDead);

  const [activePlayerId, setActivePlayerId] = useState(undefined);

  const activePlayer = useMemo(
    () => (activePlayerId ? players.find((p) => activePlayerId === p.id) : undefined),
    [activePlayerId, players]
  );

  return (
    <>
      {table?.length ? (
        <>
          <Toggle
            checked={displayDead}
            labelUnchecked={t("GameTimeline.displayAllPlayers")}
            labelChecked={t("GameTimeline.hideDeadPlayers")}
            onChange={setDisplayDead}
          />
          <GamePlayersTimeline
            table={table}
            players={players}
            actions={game.actions}
            editable={!game.started_at}
            onPlayerClick={(p) => setActivePlayerId(p.id)}
            onPlayerUpdate={onPlayerUpdate}
          />
        </>
      ) : (
        <Empty className="mb-2">{t("GameTimeline.notEnoughPlayers")}</Empty>
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
