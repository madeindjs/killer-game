import { pluralizeKills } from "@/utils/pluralize";
import PlayerAvatar from "./PlayerAvatar";
import { PlayerStatusBadge } from "./PlayerStatusBadge";
import PlayersAvatars from "./PlayersAvatars";

/**
 * @typedef PlayersTableCellPlayerProps
 * @property {import('@killer-game/types').PlayerRecord} player
 * @property {() => void} [onAvatarClick]
 *
 * @param {GamePodiumRowProps} param0
 * @returns
 */
function PlayersTableCellPlayer({ player, onAvatarClick }) {
  return (
    <>
      <div className="flex items-center space-x-3">
        <PlayerAvatar player={player} size="s" killed={player.killed_by} onClick={onAvatarClick} />
        <div>
          <p className="font-bold mb-1">{player.name}</p>
          <PlayerStatusBadge player={player} />
        </div>
      </div>
    </>
  );
}

/**
 * @typedef GamePodiumRowProps
 * @property {import('@killer-game/types').PlayerRecord | undefined} player
 * @property {import("@killer-game/types").PlayerRecord[]} kills
 *
 * @param {GamePodiumRowProps} param0
 * @returns
 */
function GamePodiumRow({ player, kills }) {
  return (
    <tr>
      <td>
        {player ? (
          <PlayersTableCellPlayer player={player} onAvatarClick={() => onAvatarClick(player)} />
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
export default function GamePodium({ podium, onPlayerClick, onPlayerUpdate, editable, onDeleteClick, onEditClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Player</th>
            <th>Kills</th>
          </tr>
        </thead>
        <tbody>
          {podium.map(({ player, kills }) => (
            <GamePodiumRow key={player.id} player={player} kills={kills} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
