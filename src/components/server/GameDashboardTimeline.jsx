import { clientServer } from "@/lib/client";
import { getTranslations } from "next-intl/server";
import Empty from "../atoms/Empty";
import GamePlayersTimeline from "../organisms/GamePlayersTimeline";

/**
 * @import {} from '@/models'
 *
 *
 * @typedef GameDashboardTimelineProps
 * @property {import("@/models").GameRecord} game
 * @property {import("@/models").PlayerRecord[]} players
 *
 * @param {GameDashboardTimelineProps} param0
 */
export default async function GameDashboardTimeline({ game, players }) {
  const t = await getTranslations("common");

  const table = await clientServer.fetchPlayersTable(game.id, game.privateToken, { displayDead: true });

  return (
    <>
      {table?.length ? (
        <GamePlayersTimeline table={table} players={players} actions={game.actions} editable={!game.startedAt} />
      ) : (
        <Empty className="mb-2">{t("GameTimeline.notEnoughPlayers")}</Empty>
      )}
    </>
  );
}
