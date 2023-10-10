"use client";
import { GAME_DEFAULT_ACTIONS } from "@/constants/game";
import { getGameUrl } from "@/lib/routes";
import { useStorageCreatedGames } from "@/lib/storage";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createGame } from "../lib/client";

export default function GameForm() {
  const { addGame } = useStorageCreatedGames();

  /** @type {import("@killer-game/types").GameCreateDTO} */
  const initialGame = { name: "My new game", actions: GAME_DEFAULT_ACTIONS.en.map((a) => ({ name: a })) };

  const [game, setGame] = useState(initialGame);
  const [busy, setBusy] = useState(false);

  // const {} = useContext(GamesCreatedContext);
  const router = useRouter();

  function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    createGame(game)
      .then((game) => {
        addGame(game);
        router.push(getGameUrl(game));
      })
      .finally(() => setBusy(false));
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={busy}>
      <div className="form-control w-full mb-3">
        <label className="label">
          <span className="label-text">Title of the game</span>
        </label>
        <input
          className="input input-bordered input-primary w-full"
          type="text"
          name="name"
          id="game__name"
          value={game.name}
          onChange={(e) => setGame({ ...game, name: e.target.value })}
          readOnly={busy}
          required
        />
      </div>
      <div className="form-control w-full mb-3">
        <label className="label">
          <span className="label-text">Actions</span>
        </label>
        <textarea
          className="textarea textarea-bordered"
          name="actions"
          defaultValue={game.actions.map((a) => a.name).join("\n")}
          onChange={(e) => setGame({ ...game, actions: e.target.value.split("\n").map((a) => ({ name: a })) })}
        ></textarea>
      </div>
      <input type="submit" className="btn btn-primary" disabled={busy} value="Create the game" />
    </form>
  );
}
