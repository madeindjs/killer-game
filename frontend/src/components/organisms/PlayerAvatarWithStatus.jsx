const { default: PlayerAvatar } = require("../molecules/PlayerAvatar");
const { PlayerStatusBadge } = require("../molecules/PlayerStatusBadge");

/**
 * @typedef Props
 * @property {import('@killer-game/types').PlayerRecord} player
 * @property {() => void} [onAvatarClick]
 *
 * @param {Props} param0
 * @returns
 */
export default function PlayerAvatarWithStatus({ player, onAvatarClick }) {
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
