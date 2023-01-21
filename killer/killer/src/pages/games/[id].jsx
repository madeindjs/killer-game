import { fetchGame } from "@/clients/games";
import GameActions from "@/components/game-actions";
import GamePlayerList from "@/components/games-player-list";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function GameShow(props) {
  const router = useRouter();

  const [gameId, setGameId] = useState((router.query.id));

  useEffect(() => {
    setGameId(router.query.id)

  }, [router.query])


  const onDestroy = () => router.push('/games')

  // const gameId = router.query.id;

  const [game, setGame] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    if (game !== undefined || gameId === undefined) return;

    setLoading(true);
    fetchGame(gameId)
      .then(setGame)
      .finally(() => setLoading(false));
  });

  return (
    <main aria-busy={loading}>
      <h1>Game: {game?.name}</h1>
      <details>
        <h2>Players</h2>
        <GamePlayerList gameId={gameId} />
        <summary>Dangerous actions</summary>
        <GameActions gameId={gameId} onDestroy={onDestroy} />
      </details>
    </main>
  );
}
