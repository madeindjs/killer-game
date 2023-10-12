/**
 * @param {{game: import("@killer-game/types").GameRecord}} param0
 */
export default function GameStartedBadge({ game }) {
  if (game.started_at) {
    return <span className="badge badge-info">in progress</span>;
  } else {
    return <span className="badge badge-neutral">un started</span>;
  }
}
