const { useId } = require("react");

/**
 * @param {{game: import("@killer-game/types").GameRecord, onChange?: () => void, readonly?: boolean}} param0
 */
export default function GameStartButton({ game, onChange, readonly }) {
  const fieldId = useId();

  return (
    <div className="form-control w-64">
      <label htmlFor={fieldId} className="label cursor-pointer">
        <input
          id={fieldId}
          type="checkbox"
          className="toggle toggle-primary"
          checked={Boolean(game.started_at)}
          onChange={onChange}
          readOnly={readonly}
        />
        <span className="label-text">
          {game.started_at ? "The game has started!" : "The game has not started yet. Start the game"}
        </span>
      </label>
    </div>
  );
}
