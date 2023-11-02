const { useId } = require("react");

/**
 * @param {{game: import("@killer-game/types").GameRecord, onChange?: () => void, readonly?: boolean}} param0
 */
export default function GameStartButton({ game, onChange, readonly }) {
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
