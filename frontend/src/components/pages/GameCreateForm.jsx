"use client";
import { GAME_DEFAULT_ACTIONS } from "@/constants/game";
import { getGameUrl } from "@/lib/routes";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGamesCreated } from "../../hooks/use-games-created";
import { client } from "../../lib/client";
import GameForm from "../molecules/GameForm";

export default function GameCreateForm() {
  const { addGame } = useGamesCreated();

  const { t, lang } = useTranslation("common");

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
        router.push(getGameUrl(game), lang);
      })
      .finally(() => setBusy(false));
  }

  return <GameForm game={game} onChange={setGame} onSubmit={handleSubmit} busy={busy} />;
}
