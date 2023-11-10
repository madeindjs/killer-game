"use client";
import { GAME_DEFAULT_ACTIONS } from "@/constants/game";
import { getGameUrl } from "@/lib/routes";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGamesCreated } from "../../hooks/use-games-created";
import { client } from "../../lib/client";

export default function GameCreateForm() {
  const { addGame } = useGamesCreated();

  const { t } = useTranslation("common");

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
          <span className="label-text">{t("GameCreateForm.nameField")}</span>
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
          <span className="label-text">{t("GameCreateForm.actionsField")}</span>
        </label>
        <textarea
          className="textarea textarea-bordered"
          name="actions"
          defaultValue={game.actions.map((a) => a.name).join("\n")}
          onChange={(e) => setGame({ ...game, actions: e.target.value.split("\n").map((a) => ({ name: a })) })}
        ></textarea>
      </div>
      <input type="submit" className="btn btn-primary" disabled={busy} value={t("GameCreateForm.submit")} />
    </form>
  );
}
