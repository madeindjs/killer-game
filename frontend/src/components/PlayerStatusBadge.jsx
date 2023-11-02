/**
 *
 * @param {{player: import("@killer-game/types").PlayerRecord}} param0
 */
export function PlayerStatusBadge({ player }) {
  if (player.killed_at) {
    return <div className="badge badge-warning badge-outline">dead</div>;
  }

  return <div className="badge badge-success badge-outline">alive</div>;
}
