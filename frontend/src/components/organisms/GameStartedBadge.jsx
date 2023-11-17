import useTranslation from "next-translate/useTranslation";
import DateTime from "../atoms/DateTime";

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
  if (game.finished_at) {
    return (
      <span className="badge badge-success">
        {t("GameStartedBadge.finished")} - <DateTime date={game.finished_at} />
      </span>
    );
  } else if (game.started_at) {
    return (
      <span className="badge badge-info">
        {t("GameStartedBadge.progress")} - <DateTime date={game.started_at} />
      </span>
    );
  } else {
    return <span className="badge badge-neutral">{t("GameStartedBadge.pending")}</span>;
  }
}
