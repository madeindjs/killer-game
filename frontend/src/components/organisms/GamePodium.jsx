import { pluralizeKills } from "@/utils/pluralize";
import Rank from "../atoms/Rank";
import PlayerAvatarWithStatus from "./PlayerAvatarWithStatus";
import PlayersAvatars from "./PlayersAvatars";

/**
 * @typedef GamePodiumRowProps
 * @property {import('@killer-game/types').PlayerRecord | undefined} player
 * @property {import("@killer-game/types").PlayerRecord[]} kills
 * @property {number} rank
 *
 * @param {GamePodiumRowProps} param0
 * @returns
 */
function GamePodiumRow({ player, kills, rank }) {
  return (
    <tr>
      <th>
        <Rank rank={rank} />
      </th>
      <td>
        {player ? (
          <PlayerAvatarWithStatus player={player} onAvatarClick={() => onAvatarClick(player)} />
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
 * @typedef GamePodiumProps
 * @property {import('@killer-game/types').GameDashboard['podium']} podium
 *
 * @param {GamePodiumProps} param0
 */
export default function GamePodium({ podium }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Kills</th>
          </tr>
        </thead>
        <tbody>
          {podium.map(({ player, kills }, index) => (
            <GamePodiumRow key={player.id} player={player} kills={kills} rank={index + 1} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
