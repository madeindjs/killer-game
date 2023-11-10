import useTranslation from "next-translate/useTranslation";

const { useId } = require("react");

/**
 * @typedef GameStartButtonI18n
 * @property {string} start
 * @property {string} stop
 * @property {string} title
 */

/**
 * @typedef GameStartButtonProps
 * @property {import('@killer-game/types').GameRecord} game
 * @property {() => void} [onChange]
 * @property {boolean} [readonly]
 *
 * @param {GameStartButtonProps} param0
 */
export default function GameStartButton({ game, onChange, readonly }) {
  const fieldId = useId();
  const { t } = useTranslation("games");

  /**
   * @param {SubmitEvent} e
   */
  function onSubmit(e) {
    e.preventDefault();
    onChange();
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor={fieldId} className="sr-only">
        <span>{t("GameStartButton.startField")}</span>
        <input
          id={fieldId}
          type="checkbox"
          checked={Boolean(game.started_at)}
          onChange={onChange}
          readOnly={readonly}
        />
      </label>
      <input
        type="submit"
        value={game.started_at ? `⏸️ ${t("GameStartButton.stop")}` : `▶️ ${t("GameStartButton.start")}`}
        className={"btn " + (game.started_at ? "btn-neutral" : "btn-primary")}
      />
    </form>
  );
}
