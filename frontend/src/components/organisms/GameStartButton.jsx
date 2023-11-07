import { DEFAULT_LANG } from "@/lib/i18n";

const { useId } = require("react");

/**
 * @typedef Props
 * @property {import('@killer-game/types').GameRecord} game
 * @property {() => void} [onChange]
 * @property {boolean} [readonly]
 * @property {import("@/lib/i18n").Lang} lang
 *
 * @param {Props} param0
 */
export default function GameStartButton({ game, onChange, readonly, lang = DEFAULT_LANG }) {
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
        <span>Game started status</span>
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
        value={game.started_at ? "⏸️ Stop the game" : "▶️ Start the game"}
        className={"btn " + (game.started_at ? "btn-neutral" : "btn-primary")}
      />
    </form>
  );
}
