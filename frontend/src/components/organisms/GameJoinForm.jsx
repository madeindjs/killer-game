"use client";
import { useGame } from "@/hooks/use-game";
import { getGameJoinUrl } from "@/lib/routes";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      <div className="form-control w-full mb-3">
        <label className="label">
          <span className="label-text">{t("GameJoinForm.gameToken")}</span>
        </label>
        <input
          className="input input-bordered input-primary w-full"
          type="text"
          name="name"
          id="game__name"
          value={gameId.name}
          onChange={(e) => setGameId(e.target.value)}
          required
        />
      </div>

      <input type="submit" className="btn btn-primary" disabled={loading || error} value={t("GameJoinForm.submit")} />
    </form>
  );
}
