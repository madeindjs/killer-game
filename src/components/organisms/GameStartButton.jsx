import { useTranslations as useTranslation } from "next-intl";

const { useId } = require("react");

/**
 * @typedef GameStartButtonProps
 * @property {import('@killer-game/types').GameRecord} game
 * @property {() => void} [onChange]
 *
 * @param {GameStartButtonProps} param0
 */
export default function GameStartButton({ game, onChange, disabled }) {
  const fieldId = useId();
  const t = useTranslation("games");

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
        <span>{t("GameStartButton.start")}</span>
        <input
          id={fieldId}
          type="checkbox"
          checked={Boolean(game.started_at)}
          onChange={onChange}
          readOnly={disabled}
        />
      </label>
      <input
        type="submit"
        value={game.started_at ? `⏸️ ${t("GameStartButton.stop")}` : `▶️ ${t("GameStartButton.start")}`}
        className={"btn " + (game.started_at ? "btn-neutral" : "btn-primary")}
        disabled={disabled}
      />
    </form>
  );
}
