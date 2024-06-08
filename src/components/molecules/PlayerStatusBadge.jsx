import { useTranslations as useTranslation } from "next-intl";

/**
 * @typedef PlayerStatusBadgeProps
 * @property {import("@killer-game/types").PlayerRecord} player
 *
 * @param {PlayerStatusBadgeProps} param0
 */
export function PlayerStatusBadge({ player }) {
  const t = useTranslation("common");

  if (player.killedAt) {
    return <div className="badge badge-warning badge-outline">{t("PlayerStatusBadge.dead")}</div>;
  }

  return <div className="badge badge-success badge-outline">{t("PlayerStatusBadge.alive")}</div>;
}
