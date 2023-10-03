"use client";
import { useState } from "react";
import { createGame } from "../lib/client";

export default function GameForm() {
  const [game, setGame] = useState({ name: "My new game" });
  const [busy, setBusy] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    createGame(game).finally(() => setBusy(false));
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={busy}>
      <input
        className="input input-bordered input-primary w-full max-w-xs"
        type="text"
        name="name"
        id="game__name"
        value={game.name}
        onChange={(e) => setGame({ ...game, name: e.target.value })}
        readOnly={busy}
        required
      />
      <input type="submit" className="btn btn-primary" disabled={busy} />
    </form>
  );
}
