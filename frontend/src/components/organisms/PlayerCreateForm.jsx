"use client";

import { useEffect, useState } from "react";
import { genConfig } from "react-nice-avatar";
import PlayerForm from "./PlayerForm";

/**
 * @typedef PlayerCreateFormI18n
 * @extends import("./PlayerForm").PlayerFormI18n
 * @property {import("./AvatarEditor").AvatarEditorI18n} AvatarEditor
 * @property {string} submit
 *
 * @typedef PlayerCreateFormProps
 * @property {boolean} busy
 * @property {string} defaultName
 * @property {onSubmit: (player) => void} [onSubmit]
 * @property {import("@killer-game/types").GameActionRecord[]} actions
 * @property {PlayerCreateFormI18n} i18n
 *
 * @param {PlayerCreateFormProps} param0
 */
export default function PlayerCreateForm({ onSubmit, busy, actions, defaultName = "My new player", i18n }) {
  const [player, setPlayer] = useState({ name: defaultName, avatar: genConfig(defaultName) });

  useEffect(() => {
    setPlayer({ name: defaultName, avatar: genConfig(defaultName) });
  }, [setPlayer, defaultName]);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(player);
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={busy}>
      <PlayerForm player={player} onChange={setPlayer} actions={actions} i18n={i18n} />

      <input type="submit" className="btn btn-primary" disabled={busy} value={i18n.submit} />
    </form>
  );
}
