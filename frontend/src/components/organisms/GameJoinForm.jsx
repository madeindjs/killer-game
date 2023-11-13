"use client";
import { useGame } from "@/hooks/use-game";
import { getGameJoinUrl } from "@/lib/routes";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import InputWithLabel from "../atoms/InputWithLabel";

/**
 * @typedef Props
 *
 * @param {Props} param0
 */
export default function GameJoinForm() {
  const [gameId, setGameId] = useState("");
  const { error, game, loading } = useGame(gameId);

  const { t } = useTranslation("common");

  const router = useRouter();

  function handleSubmit(event) {
    event.preventDefault();
    router.push(getGameJoinUrl(game));
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={loading}>
      <InputWithLabel
        label={t("GameJoinForm.gameToken")}
        name="name"
        onChange={(name) => setGameId?.(name)}
        value={gameId.name}
        className="mb-3"
        required
      />

      <input type="submit" className="btn btn-primary" disabled={loading || error} value={t("GameJoinForm.submit")} />
    </form>
  );
}
