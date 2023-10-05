import Avatar, { genConfig } from "react-nice-avatar";

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
  const config = genConfig(player.name);

  return (
    <div className="avatar placeholder" title={player.name}>
      <Avatar className={"text-neutral-content rounded-full " + (size === "s" ? "w-12 " : "w-24 ")} {...config} />
    </div>
  );
}
