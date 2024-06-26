"use client";
import { useDefaultActions } from "@/hooks/use-default-actions";
import { getGameUrl } from "@/lib/routes";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGamesCreated } from "../../hooks/use-games-created";
import { client } from "../../lib/client";
import GameForm from "../molecules/GameForm";

export default function GameCreateForm() {
  const { addGame } = useGamesCreated();

  const lang = useLocale("common");

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
        router.push(getGameUrl(game, lang));
      })
      .finally(() => setBusy(false));
  }

  return <GameForm game={initialGame} onSubmit={handleSubmit} busy={busy} />;
}
