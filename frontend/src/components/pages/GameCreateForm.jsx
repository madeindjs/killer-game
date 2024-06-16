"use client";
import { getGameUrl } from "@/lib/routes";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGamesCreated } from "../../hooks/use-games-created";
import { client } from "../../lib/client";
import GameForm from "../molecules/GameForm";

export default function GameCreateForm() {
  const { addGame } = useGamesCreated();

  const lang = useLocale();

  /** @type {import("@killer-game/types").GameCreateDTO} */
  const initialGame = { name: "" };

  const [busy, setBusy] = useState(false);

  const router = useRouter();

  /**
   * @param {import("@killer-game/types").GameCreateDTO} game
   */
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
