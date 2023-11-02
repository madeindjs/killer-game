"use client";

import { useState } from "react";
import { genConfig } from "react-nice-avatar";
import PlayerForm from "./PlayerForm";

/**
 * @typedef Props
 * @property {boolean} busy
 * @property {onSubmit: (player) => void} [onSubmit]
 * @property {import("@killer-game/types").GameActionRecord[]} actions
 *
 * @param {Props} param0
 */
export default function PlayerCreateForm({ onSubmit, busy, actions }) {
  const defaultName = "My new player";
  /** @type {import("@killer-game/types").PlayerCreateDTO} */
  const defaultPlayer = { name: defaultName, avatar: genConfig(defaultName) };

  const [player, setPlayer] = useState(defaultPlayer);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(player);
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={busy}>
      <PlayerForm player={player} onChange={setPlayer} actions={actions} />

      <input type="submit" className="btn btn-primary" disabled={busy} value="Create the player" />
    </form>
  );
}
