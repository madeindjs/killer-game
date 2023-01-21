import { fetchGamePlayers } from "@/clients/players";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 *
 * @param {{gameId: number}} props
 * @returns
 */
export default function GamePlayerList(props) {
  const [players, setPlayers] = useState();
  const [loading, setLoading] = useState(false);

  const loadPlayers = async () => {
    setLoading(true);
    try {
      setPlayers(await fetchGamePlayers(props.gameId));
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (players === undefined) loadPlayers();
  }, []);

  return (
    <>
      {loading && <p aria-busy="true">Loading</p>}
      {!loading && players && (
        <>
          <ul>
            {players.map((player) => (
              <li key={player.id}>
                <Link href={`/games/${player.id}`}>{player.name}</Link>
              </li>
            ))}
          </ul>
          <button onClick={loadPlayers}>refresh</button>
        </>
      )}
    </>
  );
}
