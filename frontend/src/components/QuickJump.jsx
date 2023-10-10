"use client";
import { useGame } from "@/hooks/use-game";
import { getGameUrl } from "@/lib/routes";
import { useStorageCreatedGames } from "@/lib/storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Fetching from "./Fetching";

function GameCreated({ gameId, gamePrivateToken }) {
  const { game, loading, error } = useGame(gameId, gamePrivateToken);

  return (
    <option value={game ? getGameUrl(game) : ""}>
      <Fetching loading={loading} error={error}>
        {game && (
          <>
            {game.name} | {game.started_at ? "started" : "un started"}
          </>
        )}
      </Fetching>
    </option>
  );
}

export default function QuickJump() {
  const { removeGame, load } = useStorageCreatedGames();

  const [games, setGames] = useState([]);

  useEffect(() => {
    // TODO: doesn't work
    setGames(load());
  }, []);

  function onError(gameId) {
    setGames(removeGame(gameId));
  }

  const router = useRouter();

  return (
    <select className="select select-bordered w-full max-w-xs" onChange={(e) => router.push(e.target.value)}>
      <option disabled selected>
        Jump to
      </option>
      <optgroup label="Games created">
        {games.map((game) => (
          <GameCreated gameId={game.id} gamePrivateToken={game.private_token} key={game.id} />
        ))}
      </optgroup>
    </select>
  );
}
