import { DEFAULT_LANG } from "@/lib/i18n";

/**
 * @typedef Props
 * @property {import('@killer-game/types').GameRecord} game
 * @property {import("@/lib/i18n").Lang} lang
 *
 * @param {Props} param0
 */
export default function GameStartedBadge({ game, lang = DEFAULT_LANG }) {
  if (game.started_at) {
    return <span className="badge badge-info">in progress</span>;
  } else {
    return <span className="badge badge-neutral">un started</span>;
  }
}
