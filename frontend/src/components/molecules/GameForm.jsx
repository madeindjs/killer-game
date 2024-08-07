"use client";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("common");

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
      <input type="submit" className="btn btn-primary" disabled={busy} value={t("GameForm.submit")} />
    </form>
  );
}
