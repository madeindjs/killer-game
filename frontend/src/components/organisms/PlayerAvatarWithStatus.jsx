const { default: PlayerAvatar } = require("../molecules/PlayerAvatar");
const { PlayerStatusBadge } = require("../molecules/PlayerStatusBadge");

/**
 * @typedef PlayerAvatarWithStatusProps
 * @property {import('@killer-game/types').PlayerRecord} player
 * @property {() => void} [onAvatarClick]
 *
 * @param {PlayerAvatarWithStatusProps} param0
 * @returns
 */
export default function PlayerAvatarWithStatus({ player, onAvatarClick }) {
  const killed = Boolean(player.killed_at);
  return (
    <>
      <div className="flex flex-col items-center justify-center al space-x-3">
        <PlayerAvatar player={player} size="s" killed={killed} onClick={onAvatarClick} />
        <p className={"font-bold text-center ml-0 mr-0 " + (killed ? "text-neutral" : "")}>{player.name}</p>
      </div>
    </>
  );
}
