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

  const [draft, setDraft] = useState(game || { name: "", organizer_email: "" });

  useEffect(() => {
    setDraft(game || { name: "", organizer_email: "" });
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
      <InputWithLabel
        label={t("GameForm.organizerEmailField")}
        name="organizer_email"
        type="email"
        onChange={(organizer_email) => setDraft({ ...draft, organizer_email })}
        value={draft.organizer_email || ""}
        className="mb-3"
        placeholder={t("GameForm.organizerEmailPlaceholder")}
        hint={t("GameForm.organizerEmailHint")}
      />
      <input type="submit" className="btn btn-primary" disabled={busy} value={t("GameForm.submit")} />
    </form>
  );
}
