/**
 * @typedef Props
 * @property {import('@killer-game/types').GameRecord} game
 * @property {string} i18nProgress
 * @property {string} i18nPending
 *
 * @param {Props} param0
 */
export default function GameStartedBadge({ game, i18nProgress, i18nPending }) {
  if (game.started_at) {
    return <span className="badge badge-info">{i18nProgress}</span>;
  } else {
    return <span className="badge badge-neutral">{i18nPending}</span>;
  }
}
