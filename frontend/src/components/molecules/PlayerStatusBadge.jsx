import { DEFAULT_LANG } from "@/lib/i18n";

/**
 * @typedef Props
 * @property {import("@killer-game/types").PlayerRecord} player
 * @property {import("@/lib/i18n").Lang} lang
 *
 * @param {Props} param0
 */
export function PlayerStatusBadge({ player, lang = DEFAULT_LANG }) {
  if (player.killed_at) {
    return <div className="badge badge-warning badge-outline">dead</div>;
  }

  return <div className="badge badge-success badge-outline">alive</div>;
}
