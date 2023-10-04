export async function createGame(game) {
  const res = await fetch("http://localhost:3001/games", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(game),
  });

  if (!res.ok) throw Error();

  const { data: gameCreated } = await res.json();

  return gameCreated;
}

export async function fetchGame(gameId, privateToken = undefined) {
  const res = await fetch(`http://localhost:3001/games/${gameId}`, {
    method: "GET",
    headers: {
      Authorization: privateToken,
    },
  });

  if (!res.ok) throw Error();

  const { data: game } = await res.json();

  return game;
}
