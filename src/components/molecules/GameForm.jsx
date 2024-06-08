"use client";
import { useTranslations as useTranslation } from "next-intl";
import { useEffect, useState } from "react";
import InputWithLabel from "../atoms/InputWithLabel";

/**
 * @typedef GameFormProps
 * @property {import("@killer-game/types").GameRecord} [game]
 * @property {(game: import("@killer-game/types").GameRecord) => void} onSubmit
 * @property {boolean} [busy]
 *
 * @param {GameFormProps} param0
 * @returns
 */
export default function GameForm({ game, busy, onSubmit }) {
  const t = useTranslation("common");

  const [draft, setDraft] = useState(game);

  useEffect(() => {
    setDraft(game);
  }, [game]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(draft);
      }}
      aria-busy={busy}
    >
      <InputWithLabel
        label={t("GameForm.nameField")}
        name="name"
        onChange={(name) => setDraft({ ...draft, name })}
        value={draft.name}
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
          defaultValue={draft.actions.map((a) => a.name).join("\n")}
          onChange={(e) => setDraft({ ...draft, actions: e.target.value.split("\n").map((a) => ({ name: a })) })}
        ></textarea>
      </div>
      <input type="submit" className="btn btn-primary" disabled={busy} value={t("GameForm.submit")} />
    </form>
  );
}
