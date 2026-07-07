"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import InputWithLabel from "../atoms/InputWithLabel";
import type { GameRecord } from "@killer-game/types";

interface GameFormProps {
  game?: Partial<GameRecord>;
  onSubmit: (game: GameRecord) => void;
  busy?: boolean;
}

export default function GameForm({ game, busy, onSubmit }: GameFormProps) {
  const t = useTranslations("common");

  const [draft, setDraft] = useState<Partial<GameRecord>>(
    game || { name: "", organizer_email: "" },
  );

  useEffect(() => {
    setDraft(game || { name: "", organizer_email: "" });
  }, [game]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(draft as GameRecord);
      }}
      aria-busy={busy}
    >
      <InputWithLabel
        label={t("GameForm.nameField")}
        name="name"
        onChange={(name) => setDraft({ ...draft, name })}
        value={draft.name ?? ""}
        className="mb-3"
        required
        autoComplete="organization"
        enterKeyHint="next"
      />
      <InputWithLabel
        label={t("GameForm.organizerEmailField")}
        name="organizer_email"
        type="email"
        onChange={(organizer_email) => setDraft({ ...draft, organizer_email })}
        value={draft.organizer_email ?? ""}
        className="mb-3"
        placeholder={t("GameForm.organizerEmailPlaceholder")}
        hint={t("GameForm.organizerEmailHint")}
        autoComplete="email"
        inputMode="email"
        enterKeyHint="send"
      />
      <input
        type="submit"
        className="btn btn-primary min-h-[2.75rem]"
        disabled={busy}
        value={t("GameForm.submit")}
      />
    </form>
  );
}