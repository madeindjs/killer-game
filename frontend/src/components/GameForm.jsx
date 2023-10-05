"use client";
import { GAME_DEFAULT_ACTIONS } from "@/constants/game";
import { getGameUrl } from "@/lib/routes";
import { useStorageCreatedGames } from "@/lib/storage";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createGame } from "../lib/client";

export default function GameForm() {
  const [game, setGame] = useState({ name: "My new game", actions: GAME_DEFAULT_ACTIONS.en });
  const [busy, setBusy] = useState(false);

  // const {} = useContext(GamesCreatedContext);
  const router = useRouter();

  function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    createGame(game)
      .then((game) => {
        useStorageCreatedGames().addGame(game);
        router.push(getGameUrl(game));
      })
      .finally(() => setBusy(false));
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={busy}>
      <div class="form-control w-full max-w-xs mb-3">
        <label class="label">
          <span class="label-text">Game's name</span>
        </label>
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
      </div>
      <div class="form-control w-full max-w-xs mb-3">
        <label class="label">
          <span class="label-text">Actions</span>
        </label>
        <textarea
          class="textarea textarea-bordered"
          name="actions"
          defaultValue={game.actions.join("\n")}
          onChange={(e) => setGame({ ...game, actions: e.target.value.split("\n") })}
        ></textarea>
      </div>
      <input type="submit" className="btn btn-primary" disabled={busy} />
    </form>
  );
}
