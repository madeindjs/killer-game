"use client";

import { useEffect, useState } from "react";
import { genConfig } from "react-nice-avatar";
import PlayerForm from "./PlayerForm";

/**
 * @typedef Props
 * @property {boolean} busy
 * @property {onSubmit: (player) => void} [onSubmit]
 * @property {string} [submitValue]
 */

/**
 * @param {Props} param0
 */
export default function PlayerCreateForm({ onSubmit, busy, submitValue }) {
  const defaultName = "My new player";
  /** @type {import("@killer-game/types").PlayerCreateDTO} */
  const defaultPlayer = { name: defaultName, avatar: genConfig(defaultName) };

  const [player, setPlayer] = useState(defaultPlayer);

  useEffect(() => {
    setPlayer((p) => ({ ...p, avatar: genConfig(p.name) }));
  }, [player.name]);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(player);
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={busy}>
      <PlayerForm player={player} onChange={setPlayer} />

      <input type="submit" className="btn btn-primary" disabled={busy} value={submitValue} />
    </form>
  );
}
