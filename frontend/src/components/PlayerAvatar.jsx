const AVATAR_COLORS = [
  "bg-success-content",
  "bg-warning-content",
  "bg-error-content",
  "bg-info-content",
  "bg-accent-focus",
  "bg-secondary-focus",
];

/**
 * @param {{player: PlayerRecord, size?: 'm' | 's'}} param0
 */
export default function PlayerAvatar({ player, size = "m" }) {
  const char = player.name[0];

  const colorIndex = char.charCodeAt(0) % AVATAR_COLORS.length;

  return (
    <div className="avatar placeholder" title={player.name}>
      <div
        className={
          "text-neutral-content rounded-full " + (size === "s" ? "w-12 " : "w-24 ") + AVATAR_COLORS[colorIndex]
        }
      >
        <span className={size === "s" ? "text-s" : "text-3xl"}>{char.toUpperCase()}</span>
      </div>
    </div>
  );
}
