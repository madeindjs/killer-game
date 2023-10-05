"use client";
import { GameContext, GameProvider } from "@/context/Game";
import { getGameUrl } from "@/lib/routes";
import { useStorageCreatedGames } from "@/lib/storage";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

function GameCreated() {
  const { game, loading, error } = useContext(GameContext);

  if (loading || !game) return <li aria-busy={true}>Loading</li>;
  if (error) return <li>error</li>;

  const url = getGameUrl(game);

  return (
    <li>
      <Link href={url}>{game.name}</Link>
    </li>
  );
}

export default function GamesCreated() {
  const { games: createdGames, removeGame, load } = useStorageCreatedGames();

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
        <GameProvider
          gameId={game.id}
          gamePrivateToken={game.private_token}
          key={game.id}
          onError={() => onError(game.id)}
        >
          <GameCreated />
        </GameProvider>
      ))}
    </ul>
  );
}
