"use client";
import { getGameUrl } from "@/lib/routes";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { GameCreateDTO, GameRecord } from "@killer-game/types";
import { useGamesCreated } from "../../hooks/use-games-created";
import { client } from "../../lib/client";
import GameForm from "../molecules/GameForm";

/**
 * Module-level constant: `GameForm` resets its draft whenever its `game` prop
 * changes, so a new object on every render would wipe what the user typed.
 */
const INITIAL_GAME: GameCreateDTO = { name: "", organizer_email: "" };

export default function GameCreateForm() {
  const { addGame } = useGamesCreated();

  const lang = useLocale();

  const [busy, setBusy] = useState(false);

  const router = useRouter();

  function handleSubmit(game: GameCreateDTO) {
    setBusy(true);
    client
      .createGame(game)
      .then((game: GameRecord) => {
        addGame(game);
        router.push(getGameUrl(game, lang));
      })
      .finally(() => setBusy(false));
  }

  return <GameForm game={INITIAL_GAME} onSubmit={handleSubmit} busy={busy} />;
}
