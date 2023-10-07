"use client";
import { useState } from "react";
import { genConfig } from "react-nice-avatar";

/**
 * @param {{onSubmit: (player) => void}} param0
 */
export default function PlayerForm({ onSubmit }) {
  const defaultName = "My new player";
  const [player, setPlayer] = useState({ name: defaultName, avatar: genConfig(defaultName) });
  const [busy, setBusy] = useState(false);

  /**
   *
   * @param {import("react").ChangeEvent<HTMLInputElement>} event
   */
  function handleNameChange(e) {
    const name = e.target.value;
    const avatar = genConfig(player.name);

    setPlayer({ ...player, name, avatar });
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(player);
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={busy}>
      <div className="form-control w-full max-w-xs mb-3">
        <label className="label">
          <span className="label-text">Name of the player</span>
        </label>
        <input
          className="input input-bordered input-primary w-full max-w-xs"
          type="text"
          name="name"
          id="player__name"
          value={player.name}
          onChange={handleNameChange}
          readOnly={busy}
          required
        />
      </div>

      <input type="submit" className="btn btn-primary" disabled={busy} />
    </form>
  );
}
