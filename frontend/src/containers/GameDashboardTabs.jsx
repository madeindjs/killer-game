"use client";
import GamePodium from "@/components/GamePodium";
import Tabs from "@/components/Tabs";
import { pluralizePlayers } from "@/utils/pluralize";
import GameDashboardTabsPlayers from "./GameDashboardTabsPlayers";
import GameDashboardTabsTimeline from "./GameDashboardTabsTimeline";

/**
 * @typedef Props
 * @property {import("@killer-game/types").GameRecord} game
 * @property {import("@killer-game/types").PlayerRecord[]} players
 * @property {import("@killer-game/types").GameDashboard['podium']} podium
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} onPlayerUpdate
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} onPlayerDelete
 *
 * @param {Props} param0
 * @returns
 */
export default function GameDashboardTabs({ game, onPlayerDelete, onPlayerUpdate, players, podium }) {
  return (
    <Tabs
      tabs={[
        {
          title: "🥊 Timeline",
          content: (
            <GameDashboardTabsTimeline
              players={players}
              game={game}
              onPlayerUpdate={onPlayerUpdate}
              onPlayerDelete={onPlayerDelete}
            />
          ),
        },
        {
          title: (
            <>
              👯 {pluralizePlayers(players.length)} <span className="ml-2 badge badge-neutral">{players.length}</span>
            </>
          ),
          content: (
            <GameDashboardTabsPlayers
              players={players}
              game={game}
              onPlayerUpdate={onPlayerUpdate}
              onPlayerDelete={onPlayerDelete}
            />
          ),
        },
        {
          title: <>🏆 Dashboard</>,
          disabled: !game.started_at,
          content: podium && <GamePodium podium={podium} />,
        },
      ]}
    />
  );
}
