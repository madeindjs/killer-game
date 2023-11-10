import useTranslation from "next-translate/useTranslation";

/**
 * @typedef Props
 * @property {import('@killer-game/types').GameRecord} game
 * @property {string} i18nProgress
 * @property {string} i18nPending
 *
 * @param {Props} param0
 */
export default function GameStartedBadge({ game }) {
  const { t } = useTranslation("common");
  if (game.started_at) {
    return <span className="badge badge-info">{t("GameStartedBadge.progress")}</span>;
  } else {
    return <span className="badge badge-neutral">{t("GameStartedBadge.pending")}</span>;
  }
}
