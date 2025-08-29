"use client";
import { pluralizeKills } from "@/utils/pluralize";
import { useTranslations } from "next-intl";
import Rank from "../atoms/Rank";
import PlayerAvatarWithStatus from "./PlayerAvatarWithStatus";
import PlayersAvatars from "./PlayersAvatars";
import type { GameDashboard, PlayerRecord } from "@killer-game/types";

interface GamePodiumRowProps {
  player: PlayerRecord | undefined;
  kills: PlayerRecord[];
  rank: number;
}
function GamePodiumRow({ player, kills, rank }: GamePodiumRowProps) {
  return (
    <tr>
      <th>
        <Rank rank={rank} />
      </th>
      <td>
        {player ? (
          <PlayerAvatarWithStatus player={player} />
        ) : (
          "Player not found"
        )}
      </td>

      <td>
        <div className="flex flex-col gap-2 justify-center"></div>
        <p className="font-bold">{pluralizeKills(kills.length)}</p>
        {kills.length > 0 && <PlayersAvatars players={kills} />}
      </td>
    </tr>
  );
}

export default function GamePodium(props: { podium: GameDashboard["podium"] }) {
  const t = useTranslations("common");
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>{t("GamePodium.rank")}</th>
            <th>{t("GamePodium.player")}</th>
            <th>{t("GamePodium.kills")}</th>
          </tr>
        </thead>
        <tbody>
          {props.podium.map(({ player, kills }, index) => (
            <GamePodiumRow
              key={player.id}
              player={player}
              kills={kills}
              rank={index + 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
