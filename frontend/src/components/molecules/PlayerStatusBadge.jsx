/**
 * @typedef PlayerStatusBadgeI18n
 * @property {string} dead
 * @property {string} alive
 *
 *
 * @typedef PlayerStatusBadgeProps
 * @property {import("@killer-game/types").PlayerRecord} player
 * @property {PlayerStatusBadgeI18n} i18n
 *
 * @param {PlayerStatusBadgeProps} param0
 */
export function PlayerStatusBadge({ player, i18n }) {
  if (player.killed_at) {
    return <div className="badge badge-warning badge-outline">{i18n.dead}</div>;
  }

  return <div className="badge badge-success badge-outline">{i18n.alive}</div>;
}
