"use client";
import { useDefaultActions } from "@/hooks/use-default-actions";
import { useGamesCreated } from "@/hooks/use-games-created";
import { client } from "@/lib/client";
import { getGameUrl } from "@/lib/routes";
import useTranslation from "next-translate/useTranslation";
import {} from "next-translate/withTranslation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GameForm from "../molecules/GameForm";

export default function GameCreateForm() {
  const { addGame } = useGamesCreated();

  const { t, lang } = useTranslation("common");

  const actions = useDefaultActions();

  /** @type {import("@killer-game/types").GameCreateDTO} */
  const initialGame = { name: "", actions: actions.map((a) => ({ name: a })) };

  const [busy, setBusy] = useState(false);

  const router = useRouter();

  function handleSubmit(game) {
    setBusy(true);
    client
      .createGame(game)
      .then((game) => {
        addGame(game);
        router.push(getGameUrl(game), lang);
      })
      .finally(() => setBusy(false));
  }

  return <GameForm game={initialGame} onSubmit={handleSubmit} busy={busy} />;
}
