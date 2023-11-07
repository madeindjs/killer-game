"use client";
import { useGame } from "@/hooks/use-game";
import { DEFAULT_LANG } from "@/lib/i18n";
import { getGameJoinUrl } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * @typedef Props
 * @property {import("@/lib/i18n").Lang} lang
 *
 * @param {Props} param0
 */
export default function GameJoinForm({ lang = DEFAULT_LANG }) {
  const [gameId, setGameId] = useState("");
  const { error, game, loading } = useGame(gameId);
  // const [busy, setBusy] = useState(false);
  // const [error, setError] = useState(false);
  // const [game, setGame]

  // useEffect(() => {
  //   setError(undefined);
  //   fetchGame(gameId)
  //     .then((game) => {

  //     })
  //     .catch(setError)
  //     .finally(() => setBusy(false));
  // }, [gameId]);

  // const {} = useContext(GamesCreatedContext);
  const router = useRouter();

  function handleSubmit(event) {
    event.preventDefault();
    router.push(getGameJoinUrl(game));
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={loading}>
      <div className="form-control w-full mb-3">
        <label className="label">
          <span className="label-text">Game token</span>
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

      <input type="submit" className="btn btn-primary" disabled={loading || error} value="Join the game" />
    </form>
  );
}
