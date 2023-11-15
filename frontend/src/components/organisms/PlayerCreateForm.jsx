"use client";

import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { genConfig } from "react-nice-avatar";
import PlayerForm from "./PlayerForm";

/**
 * @typedef PlayerCreateFormProps
 * @property {boolean} busy
 * @property {string} defaultName
 * @property {onSubmit: (player) => void} [onSubmit]
 *
 * @param {PlayerCreateFormProps} param0
 */
export default function PlayerCreateForm({ onSubmit, busy, defaultName = "My new player" }) {
  const [player, setPlayer] = useState({ name: defaultName, avatar: genConfig(defaultName) });
  const { t } = useTranslation("games");

  useEffect(() => {
    setPlayer({ name: defaultName, avatar: genConfig(defaultName) });
  }, [setPlayer, defaultName]);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(player);
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={busy}>
      <PlayerForm player={player} onChange={setPlayer} />

      <input type="submit" className="btn btn-primary" disabled={busy} value={t("PlayerCreateForm.submit")} />
    </form>
  );
}
