"use client";
import { useGame } from "@/hooks/use-game";
import { getGameUrl } from "@/lib/routes";
import { useStorageCreatedGames } from "@/lib/storage";
import Link from "next/link";
import { useEffect, useState } from "react";
import Fetching from "./Fetching";

function GameCreated({ gameId, gamePrivateToken }) {
  const { game, loading, error } = useGame(gameId, gamePrivateToken);

  return (
    <li>
      <Fetching loading={loading} error={error}>
        {game && <Link href={getGameUrl(game)}>{game.name}</Link>}
      </Fetching>
    </li>
  );
}

export default function GamesCreated() {
  const { removeGame, load } = useStorageCreatedGames();

  const [games, setGames] = useState([]);

  useEffect(() => {
    // TODO: doesn't work
    setGames(load());
  }, []);

  function onError(gameId) {
    setGames(removeGame(gameId));
  }

  return (
    <ul>
      {games.map((game) => (
        <GameCreated gameId={game.id} gamePrivateToken={game.private_token} key={game.id} />
      ))}
    </ul>
  );
}
