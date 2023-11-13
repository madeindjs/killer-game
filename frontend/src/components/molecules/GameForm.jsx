import useTranslation from "next-translate/useTranslation";
import InputWithLabel from "../atoms/InputWithLabel";

/**
 * @typedef GameFormProps
 * @property {import("@killer-game/types").GameRecord} game
 * @property {(game: import("@killer-game/types").GameRecord) => void} onChange
 * @property {() => void} onSubmit
 * @property {boolean} [busy]
 *
 * @param {GameFormProps} param0
 * @returns
 */
export default function GameForm({ game, onChange, busy, onSubmit }) {
  const { t } = useTranslation("common");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      aria-busy={busy}
    >
      <InputWithLabel
        label={t("GameForm.nameField")}
        name="name"
        onChange={(name) => onChange?.({ ...game, name })}
        value={game.name}
        className="mb-3"
        required
      />
      <div className="form-control w-full mb-3">
        <label className="label">
          <span className="label-text">{t("GameForm.actionsField")}</span>
        </label>
        <textarea
          className="textarea textarea-bordered"
          name="actions"
          defaultValue={game.actions.map((a) => a.name).join("\n")}
          onChange={(e) => onChange({ ...game, actions: e.target.value.split("\n").map((a) => ({ name: a })) })}
        ></textarea>
      </div>
      <input type="submit" className="btn btn-primary" disabled={busy} value={t("GameForm.submit")} />
    </form>
  );
}
