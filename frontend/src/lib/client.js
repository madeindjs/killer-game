export async function createGame(game) {
  // const headers = new Headers();
  // headers.append("Content-Type", "application/json");

  const res = await fetch("http://localhost:3001/games", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(game),
  });

  if (!res.ok) throw Error();

  const data = await res.json();

  return data;
}
