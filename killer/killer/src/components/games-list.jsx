import { fetchGames } from "@/clients/games";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function GameList() {
  const [games, setGames] = useState();
  const [loading, setLoading] = useState(false);

  const loadGames = async () => {
    setLoading(true);
    try {
      setGames(await fetchGames());
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (games === undefined) loadGames();
  }, []);

  return (
    <>
      {loading && <p aria-busy="true">Loading</p>}
      {!loading && games && (
        <>
          <ul>
            {games.map((game) => (
              <li key={game.id}>
                <Link href={`/games/${game.id}`}>{game.name}</Link>
              </li>
            ))}
          </ul>
          <button onClick={loadGames}>refresh</button>
        </>
      )}
    </>
  );
}
