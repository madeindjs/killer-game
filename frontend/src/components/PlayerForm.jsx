"use client";
import { useState } from "react";

/**
 * @param {{onSubmit: (player) => void}} param0
 */
export default function PlayerForm({ onSubmit }) {
  const [player, setPlayer] = useState({ name: "My new player" });
  const [busy, setBusy] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(player);
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={busy}>
      <div class="form-control w-full max-w-xs mb-3">
        <label class="label">
          <span class="label-text">Player's name</span>
        </label>
        <input
          className="input input-bordered input-primary w-full max-w-xs"
          type="text"
          name="name"
          id="player__name"
          value={player.name}
          onChange={(e) => setPlayer({ ...player, name: e.target.value })}
          readOnly={busy}
          required
        />
      </div>

      <input type="submit" className="btn btn-primary" disabled={busy} />
    </form>
  );
}
