import { pluralizeKills } from "@/utils/pluralize";
import Rank from "../atoms/Rank";
import PlayerAvatarWithStatus from "./PlayerAvatarWithStatus";
import PlayersAvatars from "./PlayersAvatars";

/**
 * @typedef GamePodiumRowI18n
 * @property {PlayerStatusBadgeI18n} PlayerStatusBadge
 *
 * @typedef GamePodiumRowProps
 * @property {import('@killer-game/types').PlayerRecord | undefined} player
 * @property {import("@killer-game/types").PlayerRecord[]} kills
 * @property {number} rank
 * @property {GamePodiumRowI18n} i18n
 *
 * @param {GamePodiumRowProps} param0
 * @returns
 */
function GamePodiumRow({ player, kills, rank, i18n }) {
  return (
    <tr>
      <th>
        <Rank rank={rank} />
      </th>
      <td>
        {player ? (
          <PlayerAvatarWithStatus
            player={player}
            onAvatarClick={() => onAvatarClick(player)}
            lang={lang}
            i18n={i18n.PlayerStatusBadge}
          />
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

/**
 * @typedef GamePodiumI18n
 * @property {string} rank
 * @property {string} player
 * @property {string} kills
 * @property {import("../molecules/PlayerStatusBadge").PlayerStatusBadgeI18n} PlayerStatusBadge
 *
 * @typedef GamePodiumProps
 * @property {import('@killer-game/types').GameDashboard['podium']} podium
 * @property {GamePodiumI18n} i18n
 *
 * @param {GamePodiumProps} param0
 */
export default function GamePodium({ podium, i18n }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>{i18n.rank}</th>
            <th>{i18n.player}</th>
            <th>{i18n.kills}</th>
          </tr>
        </thead>
        <tbody>
          {podium.map(({ player, kills }, index) => (
            <GamePodiumRow
              key={player.id}
              player={player}
              kills={kills}
              rank={index + 1}
              i18n={{ PlayerStatusBadge: i18n.PlayerStatusBadge }}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
