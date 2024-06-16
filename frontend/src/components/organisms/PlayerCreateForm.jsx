"use client";

import { useDefaultActions } from "@/hooks/use-default-actions";
import { getRandomItemInArray } from "@/utils/array";
import { useTranslations } from "next-intl";
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
  const actions = useDefaultActions();
  const [player, setPlayer] = useState({
    name: defaultName,
    avatar: genConfig(defaultName),
    action: getRandomItemInArray(actions),
  });
  const t = useTranslations("games.PlayerCreateForm");

  useEffect(() => {
    setPlayer({ name: defaultName, avatar: genConfig(defaultName), action: getRandomItemInArray(actions) });
  }, [setPlayer, defaultName, actions]);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(player);
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={busy}>
      <PlayerForm player={player} onChange={setPlayer} />
      <input type="submit" className="btn btn-primary" disabled={busy} value={t("submit")} />
    </form>
  );
}
