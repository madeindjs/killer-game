"use client";
import { pluralize } from "@/utils/pluralize";
import { useTranslations } from "next-intl";
import Rank from "../atoms/Rank";
import PlayerAvatarWithStatus from "./PlayerAvatarWithStatus";
import PlayersAvatars from "./PlayersAvatars";
import { isPlayerHidden } from "@/utils/player";
import type { GameDashboard, PlayerRecord } from "@killer-game/types";

interface GamePodiumRowProps {
  player: PlayerRecord | undefined;
  kills: PlayerRecord[];
  rank: number;
}
function GamePodiumRow({ player, kills, rank }: GamePodiumRowProps) {
  const t = useTranslations("common.GamePodium");
  const hidden = isPlayerHidden(player);
  return (
    <tr>
      <th>
        <Rank rank={rank} />
      </th>
      <td>
        {player ? (
          <PlayerAvatarWithStatus player={player} />
        ) : (
          t("playerNotFound")
        )}
      </td>

      <td>
        <div className="flex flex-col gap-2 justify-center"></div>
        <p className="font-bold">
          {hidden
            ? t("killsValueHidden", { count: kills.length })
            : `${kills.length} ${pluralize(kills.length, t("killSingular"), t("killPlural"))}`}
        </p>
        {kills.length > 0 && <PlayersAvatars players={kills} />}
      </td>
    </tr>
  );
}

export default function GamePodium(props: { podium: GameDashboard["podium"] }) {
  const t = useTranslations("common.GamePodium");
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>{t("rank")}</th>
            <th>{t("player")}</th>
            <th>{t("kills")}</th>
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
