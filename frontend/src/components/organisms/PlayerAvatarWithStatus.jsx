const { default: PlayerAvatar } = require("../molecules/PlayerAvatar");
const { PlayerStatusBadge } = require("../molecules/PlayerStatusBadge");

/**
 * @typedef PlayerAvatarWithStatusI18n
 * @property {PlayerStatusBadgeI18n} PlayerStatusBadge
 *
 * @typedef PlayerAvatarWithStatusProps
 * @property {import('@killer-game/types').PlayerRecord} player
 * @property {() => void} [onAvatarClick]
 * @property {PlayerAvatarWithStatusI18n} i18n
 *
 * @param {PlayerAvatarWithStatusProps} param0
 * @returns
 */
export default function PlayerAvatarWithStatus({ player, onAvatarClick, i18n }) {
  return (
    <>
      <div className="flex items-center space-x-3">
        <PlayerAvatar player={player} size="s" killed={player.killed_by} onClick={onAvatarClick} />
        <div>
          <p className="font-bold mb-1">{player.name}</p>
          <PlayerStatusBadge player={player} lang={lang} i18n={i18n.PlayerStatusBadge} />
        </div>
      </div>
    </>
  );
}
