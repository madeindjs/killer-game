const { default: PlayerAvatar } = require("./PlayerAvatar");
const { PlayerStatusBadge } = require("./PlayerStatusBadge");

/**
 * @typedef PlayersTableCellPlayerProps
 * @property {import('@killer-game/types').PlayerRecord} player
 * @property {() => void} [onAvatarClick]
 *
 * @param {PlayersTableRowProps} param0
 * @returns
 */
export default function PlayersTableCellPlayer({ player, onAvatarClick }) {
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
