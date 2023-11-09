"use client";
import { GAME_DEFAULT_ACTIONS } from "@/constants/game";
import { DEFAULT_LANG } from "@/lib/i18n";
import { getGameUrl } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGamesCreated } from "../../hooks/use-games-created";
import { client } from "../../lib/client";

/**
 * @param {{lang: import("@/lib/i18n").Lang}} param0
 */
export default function GameCreateForm({ lang = DEFAULT_LANG }) {
  const { addGame } = useGamesCreated();

  const translations = {
    en: {
      DEFAULT_GAME_NAME: "My new game",
      GAME_NAME: "Title of the game",
      GAME_ACTIONS: "Actions",
      SUBMIT: "Create the game",
    },
    fr: {
      DEFAULT_GAME_NAME: "Ma nouvelle partie",
      GAME_NAME: "Nom de la partie",
      GAME_ACTIONS: "Actions",
      SUBMIT: "Créer la partie",
    },
  };

  const t = translations[lang];

  /** @type {import("@killer-game/types").GameCreateDTO} */
  const initialGame = { name: t.DEFAULT_GAME_TITLE, actions: GAME_DEFAULT_ACTIONS.en.map((a) => ({ name: a })) };

  const [game, setGame] = useState(initialGame);
  const [busy, setBusy] = useState(false);

  const router = useRouter();

  function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    client
      .createGame(game)
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
          <span className="label-text">{t.GAME_NAME}</span>
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
          <span className="label-text"></span>
        </label>
        <textarea
          className="textarea textarea-bordered"
          name="actions"
          defaultValue={game.actions.map((a) => a.name).join("\n")}
          onChange={(e) => setGame({ ...game, actions: e.target.value.split("\n").map((a) => ({ name: a })) })}
        ></textarea>
      </div>
      <input type="submit" className="btn btn-primary" disabled={busy} value={t.SUBMIT} />
    </form>
  );
}
