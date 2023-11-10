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
 * @property {GameStartButtonI18n} i18n
 *
 * @param {GameStartButtonProps} param0
 */
export default function GameStartButton({ game, onChange, readonly, i18n }) {
  const fieldId = useId();

  /**
   *
   * @param {SubmitEvent} e
   */
  function onSubmit(e) {
    e.preventDefault();
    onChange();
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor={fieldId} className="sr-only">
        <span>{i18n.title}</span>
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
        value={game.started_at ? `⏸️ ${i18n.stop}` : `▶️ ${i18n.start}`}
        className={"btn " + (game.started_at ? "btn-neutral" : "btn-primary")}
      />
    </form>
  );
}
