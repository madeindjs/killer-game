import { DEFAULT_LANG } from "@/lib/i18n";

const { default: PlayerAvatar } = require("../molecules/PlayerAvatar");
const { PlayerStatusBadge } = require("../molecules/PlayerStatusBadge");

/**
 * @typedef Props
 * @property {import('@killer-game/types').PlayerRecord} player
 * @property {() => void} [onAvatarClick]
 * @property {import("@/lib/i18n").Lang} lang
 *
 * @param {Props} param0
 * @returns
 */
export default function PlayerAvatarWithStatus({ player, onAvatarClick, lang = DEFAULT_LANG }) {
  return (
    <>
      <div className="flex items-center space-x-3">
        <PlayerAvatar player={player} size="s" killed={player.killed_by} onClick={onAvatarClick} />
        <div>
          <p className="font-bold mb-1">{player.name}</p>
          <PlayerStatusBadge player={player} lang={lang} />
        </div>
      </div>
    </>
  );
}
