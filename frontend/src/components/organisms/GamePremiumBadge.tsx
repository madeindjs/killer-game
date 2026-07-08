import type { GameRecord } from "@killer-game/types";
import { useTranslations } from "next-intl";

interface GamePremiumBadgeProps {
  game: Pick<GameRecord, "premium">;
  className?: string;
}

/**
 * Renders a "Pro" badge when the game has been upgraded to premium.
 * Renders nothing when the game is not premium.
 */
export default function GamePremiumBadge({ game, className = "" }: GamePremiumBadgeProps) {
  const t = useTranslations("games");
  if (!game.premium) return null;
  return (
    <span
      className={`badge badge-primary badge-outline gap-1 ${className}`}
      title={t("GamePremiumBadge.title")}
    >
      ⭐ {t("GamePremiumBadge.label")}
    </span>
  );
}